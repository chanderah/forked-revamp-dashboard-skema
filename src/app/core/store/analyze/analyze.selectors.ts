import { createFeatureSelector } from '@ngrx/store';
import { AnalyzeState } from './analyze.reducer';

export const selectAnalyzeState = createFeatureSelector<AnalyzeState>('analyze');
