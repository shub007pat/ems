import { Injectable } from '@angular/core';
import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Store employee detail routes to preserve state
    return route.routeConfig?.path === 'employee/:id';
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (route.routeConfig?.path === 'employee/:id') {
      const id = route.params['id'];
      this.storedRoutes.set(`employee-${id}`, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (route.routeConfig?.path === 'employee/:id') {
      const id = route.params['id'];
      return this.storedRoutes.has(`employee-${id}`);
    }
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (route.routeConfig?.path === 'employee/:id') {
      const id = route.params['id'];
      return this.storedRoutes.get(`employee-${id}`) || null;
    }
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
