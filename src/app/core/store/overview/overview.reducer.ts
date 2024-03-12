import { createReducer, on } from '@ngrx/store';
import * as OverviewActions from './overview.actions';
import { MediaCount } from '../../models/media-count.model';
import { AllCount } from '../../models/all-count.model';
import { WordCloud } from '../../models/wordcloud.model';
import { ToneByMedia } from '../../models/tone-by-media.model';
import { Article } from '../../models/article.model';

export interface OverviewState {
  mediaCount: { data: MediaCount[]; error: string | null; isLoading: boolean };
  allCount: { data: AllCount | null; error: string | null; isLoading: boolean };
  wordCloud: { data: WordCloud[]; error: string | null; isLoading: boolean };
  toneByMedia: {
    data: ToneByMedia[];
    error: string | null;
    isLoading: boolean;
  };
  highlights: { data: Article[]; error: string | null; isLoading: boolean };
}

export const initialState: OverviewState = {
  mediaCount: { data: [], error: null, isLoading: false },
  allCount: { data: null, error: null, isLoading: false },
  wordCloud: { data: [], error: null, isLoading: false },
  toneByMedia: { data: [], error: null, isLoading: false },
  highlights: { data: [], error: null, isLoading: false },
};

export const overviewReducer = createReducer(
  initialState,
  on(OverviewActions.getMediaCount, (state) => ({
    ...state,
    mediaCount: { ...state.mediaCount, isLoading: true },
  })),
  on(OverviewActions.getMediaCountSuccess, (state, { data }) => ({
    ...state,
    mediaCount: { data, error: null, isLoading: false },
  })),
  on(OverviewActions.getMediaCountError, (state, { error }) => ({
    ...state,
    mediaCount: { data: [], error, isLoading: false },
  })),
  on(OverviewActions.getAllCount, (state) => ({
    ...state,
    allCount: { ...state.allCount, isLoading: true },
  })),
  on(OverviewActions.getAllCountSuccess, (state, { data }) => ({
    ...state,
    allCount: { data, error: null, isLoading: false },
  })),
  on(OverviewActions.getAllCountError, (state, { error }) => ({
    ...state,
    allCount: { data: null, error, isLoading: false },
  })),
  on(OverviewActions.getWordCloud, (state) => ({
    ...state,
    wordCloud: { ...state.wordCloud, isLoading: true },
  })),
  on(OverviewActions.getWordCloudSuccess, (state, { data }) => ({
    ...state,
    wordCloud: { data, error: null, isLoading: false },
  })),
  on(OverviewActions.getWordCloudError, (state, { error }) => ({
    ...state,
    wordCloud: { data: [], error, isLoading: false },
  })),
  on(OverviewActions.getToneByMedia, (state) => ({
    ...state,
    toneByMedia: { ...state.toneByMedia, isLoading: true },
  })),
  on(OverviewActions.getToneByMediaSuccess, (state, { data }) => ({
    ...state,
    toneByMedia: { data, error: null, isLoading: false },
  })),
  on(OverviewActions.getToneByMediaError, (state, { error }) => ({
    ...state,
    toneByMedia: { data: [], error, isLoading: false },
  })),
  on(OverviewActions.getHighlights, (state) => ({
    ...state,
    highlights: { ...state.highlights, isLoading: true },
  })),
  on(OverviewActions.getHighlightsSuccess, (state, { data }) => ({
    ...state,
    highlights: { data, error: null, isLoading: false },
  })),
  on(OverviewActions.getHighlightsError, (state, { error }) => ({
    ...state,
    highlights: { data: [], error, isLoading: false },
  }))
);
