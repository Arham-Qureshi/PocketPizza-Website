import type {
  OrderStatus,
  OrderType,
  QuoteRequest,
} from '@pokket-pizza/contract/contract';
import type { Prisma } from '../../generated/prisma/client';

export type QuoteLineInput = QuoteRequest['items'][number];

export type ResolvedQuoteLine = {
  input: QuoteLineInput;
  name: string;
  basePrice: Prisma.Decimal;
  taxRate: Prisma.Decimal;
  variant: {
    label: string;
    priceDelta: Prisma.Decimal;
    taxRate: Prisma.Decimal;
  } | null;
  addOns: {
    label: string;
    price: Prisma.Decimal;
    taxRate: Prisma.Decimal;
  }[];
};

/**
 * Customer-facing summary for GET /orders/phone/:phone (issue #43).
 * Deliberately PII-free: no name, phone or address beyond what the caller
 * supplied; total is the server-computed value stored on the order.
 */
export type PhoneOrderSummary = {
  orderNumber: string;
  publicToken: string;
  status: OrderStatus;
  orderType: OrderType;
  /** Units across all line items (sum of quantities). */
  itemCount: number;
  /** @decimal "828.00" */
  total: string;
  createdAt: string;
};

export type PhoneOrderListResponse = {
  items: PhoneOrderSummary[];
  /** Opaque cursor for the next page; null when the list is exhausted. */
  nextCursor: string | null;
};

/** Sort position of one row: current group (0) or terminal group (1), newest first inside each. */
export type OrderPhoneCursor = {
  group: 0 | 1;
  createdAt: Date;
  id: string;
};
