import { clearResourceCache } from '@/middlewares/cacheMiddleware';
import { ROUTE } from '@/routes/route.constants';

export function refreshResourceCache(routes: ROUTE | ROUTE[]): void {
  const routeList = Array.isArray(routes) ? routes : [routes];
  for (const route of routeList) {
    clearResourceCache(route);
  }
}
