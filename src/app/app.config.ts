import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { employeeReducer } from './store/employee.reducer';
import { EmployeeEffects } from './store/employee.effects';
import { CustomRouteReuseStrategy } from './strategies/route-reuse.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({ employees: employeeReducer }),
    provideEffects([EmployeeEffects]),
    provideStoreDevtools({ maxAge: 25 }),
    provideAnimationsAsync(),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
};
