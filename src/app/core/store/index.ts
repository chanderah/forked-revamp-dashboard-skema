import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { AuthEffects } from './auth/auth.effects';
import { overviewReducer, OverviewState } from './overview/overview.reducer';
import { OverviewEffects } from './overview/overview.effects';

export interface AppState {
  auth: AuthState;
  overview: OverviewState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  overview: overviewReducer,
};

export const effects = [AuthEffects, OverviewEffects];
