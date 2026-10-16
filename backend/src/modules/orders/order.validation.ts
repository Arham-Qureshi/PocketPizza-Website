import { z } from 'zod';
import {
  createOrderRequestSchema,
  indianPhoneSchema,
  quoteRequestSchema,
} from '@pokket-pizza/contract/contract';
import type { OrderStatus, OrderType } from '@pokket-pizza/contract/contract';
import { ValidationError } from '../../utils/errors';
import { normalizeIndianPhone } from '../../utils/phone';
import type { OrderPhoneCursor } from './order.types';

export const quoteSchema = quoteRequestSchema.strict();
// Contract schema already applies .strict().superRefine() — the result is a
// ZodEffects, which has no .strict() of its own.
export const createOrderSchema = createOrderRequestSchema;
export const publicTokenParamSchema = z.object({
  publicToken: z.string().regex(/^[0-9a-z]{21,64}$/, 'Not a valid order token'),
});

export const adminOrderIdParamSchema = z.object({
  id: z.string().min(1).max(64),
});

// GET /orders/phone/:phone — limit keeps the enumerable list bounded; cursor
// is opaque (see decode below) so clients page without learning the encoding.
export const phoneOrderListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().min(1).max(512).optional(),
});
export type PhoneOrderListQuery = z.infer<typeof phoneOrderListQuerySchema>;

/**
 * Shared Zod schema first (accepts +91/0 prefixes and separators), then the
 * same normalization orders are stored with — the DB holds bare 10-digit
 * numbers, so an un-normalized param would silently match nothing.
 */
export function parsePhoneParam(raw: string): string {
  const parsed = indianPhoneSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError('Validation failed', [
      'phone: not a valid Indian mobile number',
    ]);
  }
  try {
    return normalizeIndianPhone(parsed.data);
  } catch {
    throw new ValidationError('Validation failed', [
      'phone: not a valid Indian mobile number',
    ]);
  }
}

// base64url JSON over the exact sort position (group, createdAt, id). Opaque
// to clients and stable across two orders sharing a createdAt millisecond.
export function encodeOrderPhoneCursor(pos: OrderPhoneCursor): string {
  return Buffer.from(
    JSON.stringify({ g: pos.group, t: pos.createdAt.toISOString(), i: pos.id }),
    'utf8',
  ).toString('base64url');
}

const cursorPayloadSchema = z.object({
  g: z.union([z.literal(0), z.literal(1)]),
  t: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'invalid timestamp'),
  i: z.string().regex(/^c[0-9a-z]{20,}$/, 'Not a valid order id'),
});

// Tampered or malformed cursors are a 400, never a 500 — Buffer.from never
// throws on bad base64, so JSON.parse is the failure point and it is guarded.
export function decodeOrderPhoneCursor(raw: string): OrderPhoneCursor {
  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
  } catch {
    throw new ValidationError('Validation failed', ['query.cursor: invalid cursor']);
  }
  const parsed = cursorPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ValidationError('Validation failed', ['query.cursor: invalid cursor']);
  }
  return { group: parsed.data.g, createdAt: new Date(parsed.data.t), id: parsed.data.i };
}

const BASE_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

// Server-authoritative mirror of §17 / KanbanBoard rules:
// READY → OUT_FOR_DELIVERY only for DELIVERY; READY → COMPLETED only for
// PICKUP/DINE_IN; terminals reject everything incl. same-status "transitions".
export function isTransitionAllowed(
  from: OrderStatus,
  to: OrderStatus,
  orderType: OrderType,
): boolean {
  if (!BASE_TRANSITIONS[from].includes(to)) return false;
  if (from === 'READY' && to === 'OUT_FOR_DELIVERY') return orderType === 'DELIVERY';
  if (from === 'READY' && to === 'COMPLETED') return orderType !== 'DELIVERY';
  return true;
}
