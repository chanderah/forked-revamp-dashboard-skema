import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { reducers, effects } from './core/store';
import { provideEffects } from '@ngrx/effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/jwt.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideStore(reducers),
    provideEffects(effects),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
