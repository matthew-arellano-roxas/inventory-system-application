import { Request, Response, NextFunction } from 'express';

export function protectedRoute(req: Request, res: Response, next: NextFunction) {
  if (req.oidc.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
