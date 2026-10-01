import type { Request, Response } from 'express';
import {
  customerLoginSchema,
  customerSignupSchema,
} from './auth.customer.validation';
import {
  customerLogin,
  customerRefreshSession,
  customerSignup,
  getCustomerProfile,
  revokeCustomerSessionBestEffort,
} from './auth.customer.service';
import {
  COOKIE_CUSTOMER_ACCESS,
  COOKIE_CUSTOMER_REFRESH,
} from './auth.types';
import { AuthError } from '../../utils/errors';
import { sendSuccess } from '../../utils/response';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
} as const;

function setSessionCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie(COOKIE_CUSTOMER_ACCESS, accessToken, COOKIE_OPTS);
  res.cookie(COOKIE_CUSTOMER_REFRESH, refreshToken, COOKIE_OPTS);
}

export async function customerSignupController(req: Request, res: Response): Promise<void> {
  const body = customerSignupSchema.parse(req.body);
  const { accessToken, refreshToken, customer, created } = await customerSignup(
    body,
    req.ip ?? 'unknown',
  );

  setSessionCookies(res, accessToken, refreshToken);

  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, { customer }, created ? 201 : 200);
}

export async function customerLoginController(req: Request, res: Response): Promise<void> {
  const body = customerLoginSchema.parse(req.body);
  const { accessToken, refreshToken, customer } = await customerLogin(
    body,
    req.ip ?? 'unknown',
  );

  setSessionCookies(res, accessToken, refreshToken);

  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, { customer });
}

export async function customerRefreshController(
  req: Request,
  res: Response,
): Promise<void> {
  const refreshToken = req.cookies?.[COOKIE_CUSTOMER_REFRESH];
  if (typeof refreshToken !== 'string' || refreshToken.length === 0) {
    throw new AuthError();
  }

  const {
    accessToken,
    refreshToken: nextRefresh,
    customer,
  } = await customerRefreshSession(refreshToken);
  setSessionCookies(res, accessToken, nextRefresh);

  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, { customer });
}

export async function customerLogoutController(
  req: Request,
  res: Response,
): Promise<void> {
  const refreshToken = req.cookies?.[COOKIE_CUSTOMER_REFRESH];
  if (typeof refreshToken === 'string' && refreshToken.length > 0) {
    await revokeCustomerSessionBestEffort(refreshToken);
  }

  res.clearCookie(COOKIE_CUSTOMER_ACCESS, COOKIE_OPTS);
  res.clearCookie(COOKIE_CUSTOMER_REFRESH, COOKIE_OPTS);

  res.setHeader('Cache-Control', 'no-store');
  sendSuccess(res, { ok: true });
}

export async function customerMeController(req: Request, res: Response): Promise<void> {
  sendSuccess(res, await getCustomerProfile(req.customer!.id));
}
