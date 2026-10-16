import { getPrisma } from '../../config/database';
import type { CreateAddressInput, UpdateAddressInput } from './customer.validation';

export type CustomerProfileRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  restaurantId: string;
  whatsappOrderUpdates: boolean;
  whatsappStatusUpdates: boolean;
  theme: string;
  deletionRequestedAt: Date | null;
};

export type AddressRow = {
  id: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  pincode: string;
};

export type CustomerCredentialRow = {
  id: string;
  name: string;
  phone: string;
  passwordHash: string | null;
};

const profileSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  restaurantId: true,
  whatsappOrderUpdates: true,
  whatsappStatusUpdates: true,
  theme: true,
  deletionRequestedAt: true,
} as const;

const addressSelect = {
  id: true,
  line1: true,
  line2: true,
  landmark: true,
  city: true,
  pincode: true,
} as const;

export async function findCustomerProfile(id: string): Promise<CustomerProfileRow | null> {
  const prisma = await getPrisma();
  return prisma.customer.findUnique({ where: { id }, select: profileSelect });
}

export async function updateCustomerProfile(
  id: string,
  data: {
    name?: string;
    whatsappOrderUpdates?: boolean;
    whatsappStatusUpdates?: boolean;
    theme?: string;
  },
): Promise<CustomerProfileRow> {
  const prisma = await getPrisma();
  return prisma.customer.update({ where: { id }, data, select: profileSelect });
}

export async function findCustomerCredential(id: string): Promise<CustomerCredentialRow | null> {
  const prisma = await getPrisma();
  return prisma.customer.findUnique({
    where: { id },
    select: { id: true, name: true, phone: true, passwordHash: true },
  });
}

export async function updateCustomerPassword(id: string, passwordHash: string): Promise<void> {
  const prisma = await getPrisma();
  await prisma.customer.update({ where: { id }, data: { passwordHash } });
}

export async function setCustomerDeletionRequest(
  id: string,
  requestedAt: Date | null,
): Promise<void> {
  const prisma = await getPrisma();
  await prisma.customer.update({ where: { id }, data: { deletionRequestedAt: requestedAt } });
}

export async function listAddressRows(customerId: string): Promise<AddressRow[]> {
  const prisma = await getPrisma();
  // Address has no createdAt column; id (cuid) preserves creation order.
  return prisma.address.findMany({
    where: { customerId },
    orderBy: { id: 'asc' },
    select: addressSelect,
  });
}

export async function countAddresses(customerId: string): Promise<number> {
  const prisma = await getPrisma();
  return prisma.address.count({ where: { customerId } });
}

export async function createAddressRow(
  customerId: string,
  input: CreateAddressInput,
): Promise<AddressRow> {
  const prisma = await getPrisma();
  return prisma.address.create({
    data: {
      customerId,
      line1: input.line1,
      line2: input.line2 ?? null,
      landmark: input.landmark ?? null,
      city: input.city,
      pincode: input.pincode,
    },
    select: addressSelect,
  });
}

export async function findAddressRow(
  customerId: string,
  id: string,
): Promise<AddressRow | null> {
  const prisma = await getPrisma();
  return prisma.address.findFirst({ where: { id, customerId }, select: addressSelect });
}

// updateMany scoped to the owner: count 0 means "not yours or missing" and
// the service maps that to 404 without leaking whether the id exists elsewhere.
export async function updateAddressRow(
  customerId: string,
  id: string,
  data: Partial<UpdateAddressInput>,
): Promise<number> {
  const prisma = await getPrisma();
  const res = await prisma.address.updateMany({
    where: { id, customerId },
    data: {
      ...(data.line1 !== undefined && { line1: data.line1 }),
      ...(data.line2 !== undefined && { line2: data.line2 }),
      ...(data.landmark !== undefined && { landmark: data.landmark }),
      ...(data.city !== undefined && { city: data.city }),
      ...(data.pincode !== undefined && { pincode: data.pincode }),
    },
  });
  return res.count;
}

export async function removeAddressRow(customerId: string, id: string): Promise<number> {
  const prisma = await getPrisma();
  const res = await prisma.address.deleteMany({ where: { id, customerId } });
  return res.count;
}
