import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { AuthEffects } from './auth/auth.effects';
import { overviewReducer, OverviewState } from './overview/overview.reducer';
import { OverviewEffects } from './overview/overview.effects';
import { filterReducer, FilterState } from './filter/filter.reducer';
import { analyzeReducer, AnalyzeState } from './analyze/analyze.reducer';
import { AnalyzeEffects } from './analyze/analyze.effects';

export interface AppState {
  auth: AuthState;
  overview: OverviewState;
  filter: FilterState;
  analyze: AnalyzeState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  overview: overviewReducer,
  filter: filterReducer,
  analyze: analyzeReducer,
};

export const effects = [AuthEffects, OverviewEffects, AnalyzeEffects];
