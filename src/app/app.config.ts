import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/jwt.interceptors';
import { effects, reducers } from './core/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideStore(reducers),
    provideEffects(effects),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAngularSvgIcon(),
  ],
};
