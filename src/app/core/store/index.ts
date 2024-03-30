import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { AuthEffects } from './auth/auth.effects';
import { overviewReducer, OverviewState } from './overview/overview.reducer';
import { OverviewEffects } from './overview/overview.effects';
import { filterReducer, FilterState } from './filter/filter.reducer';
import { analyzeReducer, AnalyzeState } from './analyze/analyze.reducer';
import { AnalyzeEffects } from './analyze/analyze.effects';
import {
  spokespersonReducer,
  SpokespersonState,
} from './spokesperson/spokesperson.reducer';
import { SpokespersonEffects } from './spokesperson/spokesperson.effects';
import { articlesReducer, ArticlesState } from './articles/articles.reducer';
import { ArticlesEffects } from './articles/articles.effects';

export interface AppState {
  auth: AuthState;
  overview: OverviewState;
  filter: FilterState;
  analyze: AnalyzeState;
  spokesperson: SpokespersonState;
  articles: ArticlesState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  overview: overviewReducer,
  filter: filterReducer,
  analyze: analyzeReducer,
  spokesperson: spokespersonReducer,
  articles: articlesReducer,
};

export const effects = [
  AuthEffects,
  OverviewEffects,
  AnalyzeEffects,
  SpokespersonEffects,
  ArticlesEffects
];
