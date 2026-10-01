import { Router } from 'express';
import { ah } from '../../utils/async-handler';
import { requireCustomer } from '../../middleware/auth.middleware';
import {
  customerLoginRateLimit,
  customerSignupRateLimit,
  refreshRateLimit,
} from '../../middleware/rateLimit.middleware';
import {
  customerLoginController,
  customerLogoutController,
  customerMeController,
  customerRefreshController,
  customerSignupController,
} from './auth.customer.controller';

export const customerAuthRouter = Router();

customerAuthRouter.post('/signup', customerSignupRateLimit, ah(customerSignupController));
customerAuthRouter.post('/login', customerLoginRateLimit, ah(customerLoginController));
customerAuthRouter.post('/refresh', refreshRateLimit, ah(customerRefreshController));
customerAuthRouter.post('/logout', ah(customerLogoutController));
customerAuthRouter.get('/me', requireCustomer, ah(customerMeController));
