import { createFeatureSelector } from '@ngrx/store';
import { SpokespersonState } from './spokesperson.reducer';

export const selectSpokespersonState = createFeatureSelector<SpokespersonState>('spokesperson');
