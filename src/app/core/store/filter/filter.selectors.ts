import { createFeatureSelector } from '@ngrx/store';
import { FilterState } from './filter.reducer';

export const selectFilterState = createFeatureSelector<FilterState>('filter');
