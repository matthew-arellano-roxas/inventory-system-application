// src/routes/opex.route.ts
import { Router } from 'express';
import { validateBody, validateParams, validateQuery } from '@/middlewares/validate';
import { opexController } from '@/controllers';
import { GetOpexQuery, CreateOpexBody, DeleteOpexParams } from '@/schemas';
import { cacheMiddleware, checkPermissions, invalidateCache } from '@/middlewares';
import { ROUTE, TTL } from '@/enums';

const opexRoute = Router();

// GET /?page=1&branchId=123
opexRoute.get(
  '/',
  checkPermissions(['read:expense']),
  validateQuery(GetOpexQuery),
  cacheMiddleware(TTL.ONE_MINUTE),
  opexController.getOpexList,
);

// POST /
opexRoute.post(
  '/',
  checkPermissions(['create:expense']),
  validateBody(CreateOpexBody),
  invalidateCache(ROUTE.OPEX),
  opexController.createOpex,
);

// DELETE /:id
opexRoute.delete(
  '/:id',
  checkPermissions(['delete:expense']),
  validateParams(DeleteOpexParams),
  invalidateCache(ROUTE.OPEX),
  opexController.deleteOpex,
);

export { opexRoute };
