import { Routes, mapToCanActivate } from '@angular/router';
import { AuthGuardService } from './core/guards/auth-guard.service';
import { DashboardRoutes } from './modules/dashboard/dashboard.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    children: DashboardRoutes,
    canActivate: mapToCanActivate([AuthGuardService]),
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/login/login.component').then((module) => module.LoginComponent),
  },
];
