import { createAction, props } from '@ngrx/store';
import { FilterState } from './filter.reducer';

export const setFilter = createAction('[Filter] Set Filter', props<{ filter: FilterState }>());
