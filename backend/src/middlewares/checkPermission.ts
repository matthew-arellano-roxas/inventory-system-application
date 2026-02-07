import type { Request, Response, NextFunction, RequestHandler } from 'express';

type Permission = string;

type JwtPayloadWithPermissions = {
  permissions?: Permission[];
  // allow other claims without over-typing
  [key: string]: unknown;
};

function checkPermissions(requiredPermissions: Permission[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.auth is provided by express-oauth2-jwt-bearer
    const auth = (req as Request & { auth?: { payload?: unknown } }).auth;

    const payload = (auth?.payload ?? {}) as JwtPayloadWithPermissions;
    const permissions = Array.isArray(payload.permissions) ? payload.permissions : [];

    const hasAllPermissions = requiredPermissions.every((p) => permissions.includes(p));

    if (!hasAllPermissions) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have the required permissions',
        required: requiredPermissions,
        yours: permissions,
      });
      return;
    }

    next();
  };
}

export { checkPermissions };
