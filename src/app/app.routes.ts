import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'employees',
    loadComponent: () => import('./components/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'employee/:id',
    loadComponent: () => import('./components/employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'employee-form',
    loadComponent: () => import('./components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'employee-form/:id',
    loadComponent: () => import('./components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  { path: '**', redirectTo: '/login' }
];
