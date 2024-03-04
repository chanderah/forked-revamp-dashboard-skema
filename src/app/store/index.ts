import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { AuthEffects } from './auth/auth.effects';

interface AppState {
  authState: AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  authState: authReducer,
};

export const effects = [AuthEffects];
