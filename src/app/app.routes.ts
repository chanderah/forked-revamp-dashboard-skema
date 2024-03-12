import { Routes, mapToCanActivate } from '@angular/router';
import { AuthGuardService } from './core/guards/auth-guard.service';
import { DashboardRoutes } from './modules/dashboard/dashboard.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/jwt.interceptors';

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
    loadComponent: () =>
      import('./modules/login/login.component').then(
        (module) => module.LoginComponent
      ),
  },
];
