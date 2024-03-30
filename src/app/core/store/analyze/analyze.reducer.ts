import { createReducer, on } from '@ngrx/store';
import * as AnalyzeActions from './analyze.actions';
import { Article } from '../../models/article.model';
import { Tones } from '../../models/tone.model';
import { MediaVisibility } from '../../models/media-visibility.model';
import { ToneByCategory } from '../../models/tone-by-category.model';
import { ToneByMedia } from '../../models/tone-by-media.model';
import { TopIssueResponseData } from '../../models/issue.model';

export interface AnalyzeState {
  highlights: { data: Article[]; error: string | null; isLoading: boolean };
  tones: { data: Tones | null; error: string | null; isLoading: boolean };
  mediaVisibility: {
    data: MediaVisibility[];
    error: string | null;
    isLoading: boolean;
  };
  toneByCategory: {
    data: ToneByCategory[];
    error: string | null;
    isLoading: boolean;
  };
  toneByMedia: {
    data: ToneByMedia[];
    error: string | null;
    isLoading: boolean;
  };
  topIssue: {
    data: TopIssueResponseData | null;
    error: string | null;
    isLoading: boolean;
  };
  articlesByTone: {
    data: Article[];
    error: string | null;
    isLoading: boolean;
  };
}

export const initialState: AnalyzeState = {
  highlights: { data: [], error: null, isLoading: false },
  tones: { data: null, error: null, isLoading: false },
  mediaVisibility: { data: [], error: null, isLoading: false },
  toneByCategory: { data: [], error: null, isLoading: false },
  toneByMedia: { data: [], error: null, isLoading: false },
  topIssue: { data: null, error: null, isLoading: false },
  articlesByTone: { data: [], error: null, isLoading: false },
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
  })),

  on(AnalyzeActions.getMediaVisibility, (state) => ({
    ...state,
    mediaVisibility: { ...state.mediaVisibility, isLoading: true },
  })),
  on(AnalyzeActions.getMediaVisibilitySuccess, (state, { data }) => ({
    ...state,
    mediaVisibility: { data, error: null, isLoading: false },
  })),
  on(AnalyzeActions.getMediaVisibilityError, (state, { error }) => ({
    ...state,
    mediaVisibility: { data: [], error, isLoading: false },
  })),

  on(AnalyzeActions.getToneByCategory, (state) => ({
    ...state,
    toneByCategory: { ...state.toneByCategory, isLoading: true },
  })),
  on(AnalyzeActions.getToneByCategorySuccess, (state, { data }) => ({
    ...state,
    toneByCategory: { data, error: null, isLoading: false },
  })),
  on(AnalyzeActions.getToneByCategoryError, (state, { error }) => ({
    ...state,
    toneByCategory: { data: [], error, isLoading: false },
  })),

  on(AnalyzeActions.getToneByMedia, (state) => ({
    ...state,
    toneByMedia: { ...state.toneByMedia, isLoading: true },
  })),
  on(AnalyzeActions.getToneByMediaSuccess, (state, { data }) => ({
    ...state,
    toneByMedia: { data, error: null, isLoading: false },
  })),
  on(AnalyzeActions.getToneByMediaError, (state, { error }) => ({
    ...state,
    topIssue: { data: null, error, isLoading: false },
  })),

  on(AnalyzeActions.getTopIssue, (state) => ({
    ...state,
    topIssue: { ...state.topIssue, isLoading: true },
  })),
  on(AnalyzeActions.getTopIssueSuccess, (state, { data }) => ({
    ...state,
    topIssue: { data, error: null, isLoading: false },
  })),
  on(AnalyzeActions.getTopIssueError, (state, { error }) => ({
    ...state,
    topIssue: { data: null, error, isLoading: false },
  })),

  on(AnalyzeActions.getArticlesByTone, (state) => ({
    ...state,
    articlesByTone: { ...state.articlesByTone, isLoading: true },
  })),
  on(AnalyzeActions.getArticlesByToneSuccess, (state, { data }) => ({
    ...state,
    articlesByTone: { data, error: null, isLoading: false },
  })),
  on(AnalyzeActions.getArticlesByToneError, (state, { error }) => ({
    ...state,
    articlesByTone: { data: [], error, isLoading: false },
  }))
);
