import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  isLoggedIn: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state) => {
    return {
        ...state,
        isLoggedIn: true,
        error: null,
      }
  }),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoggedIn: false,
    error,
  }))
);
