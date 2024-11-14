import { createFeatureSelector } from '@ngrx/store';
import { OverviewState } from './overview.reducer';

export const selectOverviewState = createFeatureSelector<OverviewState>('overview');
