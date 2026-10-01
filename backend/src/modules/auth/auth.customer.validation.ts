import { z } from 'zod';

// Backend-local schemas (frozen contract has no customer auth shapes).
// Phone is validated structurally here; canonical 10-digit normalization
// happens in the service via normalizeIndianPhone (plain-Error → 400 there),
// keeping zod@3 / contract-zod concerns separate.
export const customerSignupSchema = z.object({
  phone: z.string().min(6).max(20),
  name: z.string().trim().min(1).max(255),
  password: z.string().min(8).max(128),
  email: z.string().trim().toLowerCase().email().max(255).optional(),
}).strict();

export const customerLoginSchema = z.object({
  phone: z.string().min(6).max(20),
  password: z.string().min(1).max(128),
}).strict();

export type CustomerSignupInput = z.infer<typeof customerSignupSchema>;
export type CustomerLoginInput = z.infer<typeof customerLoginSchema>;
