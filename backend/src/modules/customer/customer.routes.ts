import { Router } from 'express';
import { ah } from '../../utils/async-handler';
import {
  cancelDeletionController,
  changePasswordController,
  createAddressController,
  deleteAddressController,
  getPreferencesController,
  getProfileController,
  listAddressesController,
  patchAddressController,
  patchPreferencesController,
  patchProfileController,
  requestDeletionController,
} from './customer.controller';

// mounted at /api/v1/customer behind requireCustomer (see app.ts)
export const customerRouter = Router();

customerRouter.get('/me', ah(getProfileController));
customerRouter.patch('/me', ah(patchProfileController));

customerRouter.get('/me/preferences', ah(getPreferencesController));
customerRouter.patch('/me/preferences', ah(patchPreferencesController));

customerRouter.get('/me/addresses', ah(listAddressesController));
customerRouter.post('/me/addresses', ah(createAddressController));
customerRouter.patch('/me/addresses/:id', ah(patchAddressController));
customerRouter.delete('/me/addresses/:id', ah(deleteAddressController));

customerRouter.patch('/me/password', ah(changePasswordController));

customerRouter.post('/me/deletion-request', ah(requestDeletionController));
customerRouter.delete('/me/deletion-request', ah(cancelDeletionController));
