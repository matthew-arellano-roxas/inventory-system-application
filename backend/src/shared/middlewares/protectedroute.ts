import { Request, Response, NextFunction } from 'express';

export function protectedRoute(req: Request, res: Response, _next: NextFunction) {
  if (req.oidc.isAuthenticated()) {
    return _next();
  }
  res.redirect('/login');
}
