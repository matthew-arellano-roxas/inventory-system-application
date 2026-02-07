import { announcementController } from '@/controllers';
import { cacheMiddleware } from '@/middlewares/cache';
import { Router } from 'express';
import { TTL } from '@/enums';
import { checkPermissions } from '@/middlewares';

const annoucementRoute: Router = Router();

annoucementRoute.get(
  '/',
  checkPermissions(['read:announce']),
  cacheMiddleware(TTL.ONE_MINUTE),
  announcementController.getAnnoucements,
);

export { annoucementRoute };
