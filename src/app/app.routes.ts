import { Routes, mapToCanActivate } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuardService } from './core/guards/auth-guard.service';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  {
    path: '',
    title: 'Overview',
    pathMatch: 'full',
    component: DashboardComponent,
    canActivate: mapToCanActivate([AuthGuardService]),
  },
];
