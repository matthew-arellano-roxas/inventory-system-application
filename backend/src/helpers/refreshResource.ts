import { clearResourceCache } from '@/middlewares/cache';
import { ROUTE } from '@/enums/product.enums';

export function refreshResourceCache(routes: ROUTE | ROUTE[]): void {
  const routeList = Array.isArray(routes) ? routes : [routes];
  for (const route of routeList) {
    clearResourceCache(route);
  }
}
