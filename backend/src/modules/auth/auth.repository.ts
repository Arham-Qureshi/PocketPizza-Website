import { getPrisma } from '../../config/database';
import type { AdminRow, CustomerRow, RefreshTokenRow } from './auth.types';

const select = {
  id: true,
  email: true,
  name: true,
  passwordHash: true,
  role: true,
  restaurantId: true,
} as const;

const refreshTokenSelect = {
  jti: true,
  familyId: true,
  adminId: true,
  customerId: true,
  usedAt: true,
  revokedAt: true,
  expiresAt: true,
} as const;

const customerSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  restaurantId: true,
} as const;

const customerAuthSelect = {
  ...customerSelect,
  passwordHash: true,
} as const;

export async function findAdminByEmail(email: string): Promise<AdminRow | null> {
  const prisma = await getPrisma();
  return prisma.adminUser.findUnique({ where: { email }, select });
}

export async function findAdminById(id: string): Promise<AdminRow | null> {
  const prisma = await getPrisma();
  return prisma.adminUser.findUnique({ where: { id }, select });
}

export async function insertRefreshToken(row: {
  jti: string;
  familyId: string;
  adminId?: string;
  customerId?: string;
  expiresAt: Date;
}): Promise<void> {
  if (!!row.adminId === !!row.customerId) {
    throw new Error('insertRefreshToken requires exactly one of adminId, customerId');
  }
  const prisma = await getPrisma();
  await prisma.refreshToken.create({ data: row });
}

export async function findRefreshTokenByJti(jti: string): Promise<RefreshTokenRow | null> {
  const prisma = await getPrisma();
  return prisma.refreshToken.findUnique({ where: { jti }, select: refreshTokenSelect });
}

// Atomic rotation shared by admin and customer sessions: consume the old jti
// and insert its replacement in one transaction, serialized per login family
// with a transaction-scoped advisory lock. The same lock is taken by
// revokeRefreshFamily, so either revocation commits first (rotation then sees
// revokedAt and aborts — no orphan insert) or rotation commits first (the
// later revocation statement sees the replacement row). Lock-key lookup is
// safe outside the lock: familyId is immutable (rows are only inserted,
// jti→family mapping never changes), and the row is re-validated after the
// lock is held. Sentinel is a plain Error (never AppError) so it can never
// leak into HTTP error mapping. See PG 18 §13.3.5 + sql-set (SET LOCAL).
class RotationFailed extends Error {}

// pg_advisory_xact_lock returns void, which the driver adapter cannot decode
// (UnsupportedNativeDataType) — so take the boolean try_ variant in a bounded
// poll instead. Same mutual exclusion (proven live on this database), no
// orphan waits: transaction-scoped locks release with the transaction.
type RawTx = {
  $queryRaw: <T>(query: TemplateStringsArray, ...values: unknown[]) => Promise<T>;
};

async function acquireFamilyLock(tx: RawTx, familyId: string): Promise<void> {
  const started = Date.now();
  for (;;) {
    const rows = await tx.$queryRaw<{ locked: boolean }[]>`
      SELECT pg_try_advisory_xact_lock(hashtextextended(${familyId}::text, 0::bigint)) AS locked`;
    if (rows[0]?.locked) return;
    if (Date.now() - started > 10_000) throw new RotationFailed();
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

export async function rotateRefreshToken(
  oldJti: string,
  next: { jti: string; adminId?: string; customerId?: string; expiresAt: Date },
): Promise<boolean> {
  const prisma = await getPrisma();
  try {
    // generous pool wait: rotation runs ~hourly per user and must not fail
    // open a user out during transient pool pressure; contention fail is 401-safe
    await prisma.$transaction(
      async (tx) => {
      const key = await tx.refreshToken.findUnique({
        where: { jti: oldJti },
        select: { familyId: true },
      });
      if (!key) throw new RotationFailed();
      await tx.$executeRaw`SET LOCAL lock_timeout = '10s'`;
      await acquireFamilyLock(tx, key.familyId);
      const current = await tx.refreshToken.findUnique({ where: { jti: oldJti } });
      if (!current || current.revokedAt || current.usedAt) throw new RotationFailed();
      if (next.adminId !== undefined && current.adminId !== next.adminId) {
        throw new RotationFailed();
      }
      if (next.customerId !== undefined && current.customerId !== next.customerId) {
        throw new RotationFailed();
      }
      const res = await tx.refreshToken.updateMany({
        where: { jti: oldJti, usedAt: null, revokedAt: null },
        data: { usedAt: new Date() },
      });
      if (res.count !== 1) throw new RotationFailed();
      await tx.refreshToken.create({
        data: {
          jti: next.jti,
          familyId: key.familyId,
          adminId: next.adminId ?? null,
          customerId: next.customerId ?? null,
          expiresAt: next.expiresAt,
        },
      });
      },
      { maxWait: 10_000, timeout: 20_000 },
    );
    return true;
  } catch (err) {
    if (err instanceof RotationFailed) return false;
    throw err;
  }
}

export async function revokeRefreshFamily(familyId: string): Promise<void> {
  const prisma = await getPrisma();
  await prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SET LOCAL lock_timeout = '10s'`;
      await acquireFamilyLock(tx, familyId);
      await tx.refreshToken.updateMany({
        where: { familyId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    },
    { maxWait: 10_000, timeout: 20_000 },
  );
}

export async function pruneExpiredRefreshTokens(): Promise<void> {
  const prisma = await getPrisma();
  await prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}

export async function findCustomerByPhone(phone: string): Promise<CustomerRow | null> {
  const prisma = await getPrisma();
  return prisma.customer.findUnique({ where: { phone }, select: customerAuthSelect });
}

export async function findCustomerById(
  id: string,
): Promise<Omit<CustomerRow, 'passwordHash'> | null> {
  const prisma = await getPrisma();
  return prisma.customer.findUnique({ where: { id }, select: customerSelect });
}

export async function createCustomerWithCredential(input: {
  restaurantId: string;
  name: string;
  phone: string;
  email: string | null;
  passwordHash: string;
}): Promise<Omit<CustomerRow, 'passwordHash'>> {
  const prisma = await getPrisma();
  return prisma.customer.create({ data: input, select: customerSelect });
}

// Claim a guest row (no password set yet). Conditional so concurrent claims
// serialize: exactly one wins, the loser sees count 0.
export async function setCustomerCredential(input: {
  id: string;
  passwordHash: string;
  email: string | null;
}): Promise<boolean> {
  const prisma = await getPrisma();
  const res = await prisma.customer.updateMany({
    where: { id: input.id, passwordHash: null },
    data: { passwordHash: input.passwordHash, email: input.email },
  });
  return res.count === 1;
}

export async function findFirstRestaurantId(): Promise<string | null> {
  const prisma = await getPrisma();
  const row = await prisma.restaurant.findFirst({ select: { id: true } });
  return row?.id ?? null;
}
