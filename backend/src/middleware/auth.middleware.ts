import type { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { env } from '../config/env';
import { AuthError } from '../utils/errors';
import { findAdminById, findCustomerById } from '../modules/auth/auth.repository';
import {
  ACCESS_TOKEN_TYP,
  COOKIE_ADMIN_ACCESS,
  COOKIE_CUSTOMER_ACCESS,
  CUSTOMER_ACCESS_TOKEN_TYP,
  type AccessTokenClaims,
  type CustomerAccessClaims,
} from '../modules/auth/auth.types';

export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.[COOKIE_ADMIN_ACCESS];
    if (typeof token !== 'string' || token.length === 0) {
      throw new AuthError();
    }

    const secret = new TextEncoder().encode(env.JWT_SECRET);
    let payload: AccessTokenClaims;
    try {
      ({ payload } = (await jwtVerify(token, secret, {
        algorithms: ['HS256'],
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      })) as { payload: AccessTokenClaims });
    } catch {
      throw new AuthError();
    }

    const claims = payload as Partial<AccessTokenClaims>;
    if (claims.typ !== ACCESS_TOKEN_TYP || typeof claims.sub !== 'string') {
      throw new AuthError();
    }

    const admin = await findAdminById(claims.sub);
    if (!admin) {
      throw new AuthError();
    }

    req.admin = {
      id: admin.id,
      restaurantId: admin.restaurantId,
      role: admin.role,
    };
    next();
  } catch (err) {
    // jwtVerify failures → AuthError above; infra/Prisma pass through as 500
    next(err);
  }
}

export async function requireCustomer(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.[COOKIE_CUSTOMER_ACCESS];
    if (typeof token !== 'string' || token.length === 0) {
      throw new AuthError();
    }

    const secret = new TextEncoder().encode(env.JWT_SECRET);
    let payload: CustomerAccessClaims;
    try {
      ({ payload } = (await jwtVerify(token, secret, {
        algorithms: ['HS256'],
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      })) as { payload: CustomerAccessClaims });
    } catch {
      throw new AuthError();
    }

    const claims = payload as Partial<CustomerAccessClaims>;
    if (claims.typ !== CUSTOMER_ACCESS_TOKEN_TYP || typeof claims.sub !== 'string') {
      throw new AuthError();
    }

    const customer = await findCustomerById(claims.sub);
    if (!customer) {
      throw new AuthError();
    }

    req.customer = {
      id: customer.id,
      restaurantId: customer.restaurantId,
    };
    next();
  } catch (err) {
    // jwtVerify failures → AuthError above; infra/Prisma pass through as 500
    next(err);
  }
}
