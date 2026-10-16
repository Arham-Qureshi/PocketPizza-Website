import { z } from 'zod';

// Backend-local schemas: the frozen shared contract has no customer profile
// shapes (same stance as auth.customer.validation.ts); promoting these to the
// shared contract is the signed-off follow-up.

/** Stored on a free String column, so new themes ship without a migration. */
export const themeSchema = z.enum(['system', 'light', 'dark']);

export const preferencesUpdateSchema = z
  .object({
    whatsappOrderUpdates: z.boolean().optional(),
    whatsappStatusUpdates: z.boolean().optional(),
    theme: themeSchema.optional(),
  })
  .strict();

/**
 * PATCH /customer/me — mutable fields only: name and preferences.
 * .strict() turns phone (the account key; verified-change flow is out of
 * scope) and email into a 400 instead of a silent no-op.
 */
export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    preferences: preferencesUpdateSchema.optional(),
  })
  .strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PreferencesUpdateInput = z.infer<typeof preferencesUpdateSchema>;

export const addressIdParamSchema = z.object({
  id: z.string().regex(/^c[0-9a-z]{20,}$/, 'Not a valid CUID'),
});

// Mirrors the contract's addressSchema (frozen, resolves zod@4) on the
// backend's zod@3 so z.infer here is natively typed.
export const createAddressSchema = z.object({
  line1: z.string().trim().min(1).max(255),
  line2: z.string().max(255).optional(),
  landmark: z.string().max(255).optional(),
  city: z.string().trim().min(1).max(100),
  pincode: z.string().trim().regex(/^\d{6}$/, 'must be a 6-digit Indian PIN code'),
});

// .strict() rejects unknown keys; nullable line2/landmark let a patch clear
// the field (undefined = leave unchanged, null = clear).
export const updateAddressSchema = z
  .object({
    line1: z.string().trim().min(1).max(255).optional(),
    line2: z.string().max(255).nullable().optional(),
    landmark: z.string().max(255).nullable().optional(),
    city: z.string().trim().min(1).max(100).optional(),
    pincode: z.string().trim().regex(/^\d{6}$/, 'must be a 6-digit Indian PIN code').optional(),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(8).max(128),
  })
  .strict();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
