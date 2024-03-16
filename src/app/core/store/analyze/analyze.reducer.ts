import { createReducer, on } from '@ngrx/store';
import * as AnalyzeActions from './analyze.actions';
import { Article } from '../../models/article.model';
import { Tones } from '../../models/tone.model';

export interface AnalyzeState {
  highlights: { data: Article[]; error: string | null; isLoading: boolean };
  tones: { data: Tones | null; error: string | null; isLoading: boolean };
}

export const initialState: AnalyzeState = {
  highlights: { data: [], error: null, isLoading: false },
  tones: { data: null, error: null, isLoading: false },
};

export const analyzeReducer = createReducer(
  initialState,
  on(AnalyzeActions.getHighlights, (state) => ({
    ...state,
    highlights: { ...state.highlights, isLoading: true },
  })),
  on(AnalyzeActions.getHighlightsSuccess, (state, { data }) => ({
    ...state,
    highlights: { data, error: null, isLoading: false },
  })),
  on(AnalyzeActions.getHighlightsError, (state, { error }) => ({
    ...state,
    highlights: { data: [], error, isLoading: false },
  })),

  on(AnalyzeActions.getTones, (state) => ({
    ...state,
    tones: { ...state.tones, isLoading: true },
  })),
  on(AnalyzeActions.getTonesSuccess, (state, { data }) => ({
    ...state,
    tones: { data, error: null, isLoading: false },
  })),
  on(AnalyzeActions.getTonesError, (state, { error }) => ({
    ...state,
    tones: { data: null, error, isLoading: false },
  }))
);
