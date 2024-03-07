import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from '../../models/user.model';

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  error: string | null;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { user }) => {
    return {
      ...state,
      user,
      isLoggedIn: true,
      error: null,
    };
  }),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isLoggedIn: false,
    error,
  }))
);
