import type { Request, Response } from 'express';
import {
  addressIdParamSchema,
  changePasswordSchema,
  createAddressSchema,
  updateAddressSchema,
  updateProfileSchema,
} from './customer.validation';
import {
  cancelDeletion,
  changePassword,
  createAddress,
  deleteAddress,
  getProfile,
  listAddresses,
  patchAddress,
  patchProfile,
  requestDeletion,
} from './customer.service';
import { sendSuccess } from '../../utils/response';

export async function getProfileController(req: Request, res: Response): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, await getProfile(req.customer!.id));
}

export async function patchProfileController(req: Request, res: Response): Promise<void> {
  const body = updateProfileSchema.parse(req.body);
  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, await patchProfile(req.customer!.id, body));
}

export async function listAddressesController(req: Request, res: Response): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, await listAddresses(req.customer!.id));
}

export async function createAddressController(req: Request, res: Response): Promise<void> {
  const body = createAddressSchema.parse(req.body);
  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, await createAddress(req.customer!.id, body), 201);
}

export async function patchAddressController(req: Request, res: Response): Promise<void> {
  const { id } = addressIdParamSchema.parse(req.params);
  const body = updateAddressSchema.parse(req.body);
  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, await patchAddress(req.customer!.id, id, body));
}

export async function deleteAddressController(req: Request, res: Response): Promise<void> {
  const { id } = addressIdParamSchema.parse(req.params);
  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, await deleteAddress(req.customer!.id, id));
}

export async function changePasswordController(req: Request, res: Response): Promise<void> {
  const body = changePasswordSchema.parse(req.body);
  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, await changePassword(req.customer!.id, body));
}

export async function requestDeletionController(req: Request, res: Response): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, await requestDeletion(req.customer!.id));
}

export async function cancelDeletionController(req: Request, res: Response): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, await cancelDeletion(req.customer!.id));
}
