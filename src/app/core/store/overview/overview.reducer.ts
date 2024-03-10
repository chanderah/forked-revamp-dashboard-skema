import { createReducer, on } from '@ngrx/store';
import * as OverviewActions from './overview.actions';
import { MediaCount } from '../../models/media-count.model';
import { AllCount } from '../../models/all-count.model';
import { WordCloud } from '../../models/wordcloud.model';
import { ToneByMedia } from '../../models/tone-by-media.model';

export interface OverviewState {
  mediaCount: { data: MediaCount[]; error: string | null };
  allCount: { data: AllCount | null; error: string | null };
  wordCloud: { data: WordCloud[]; error: string | null };
  toneByMedia: { data: ToneByMedia[]; error: string | null };
}

export const initialState: OverviewState = {
  mediaCount: { data: [], error: null },
  allCount: { data: null, error: null },
  wordCloud: { data: [], error: null },
  toneByMedia: { data: [], error: null },
};

export const overviewReducer = createReducer(
  initialState,
  on(OverviewActions.getMediaCountSuccess, (state, { data }) => ({
    ...state,
    mediaCount: { data, error: null },
  })),
  on(OverviewActions.getMediaCountError, (state, { error }) => ({
    ...state,
    mediaCount: { data: [], error },
  })),
  on(OverviewActions.getAllCountSuccess, (state, { data }) => ({
    ...state,
    allCount: { data, error: null },
  })),
  on(OverviewActions.getAllCountError, (state, { error }) => ({
    ...state,
    allCount: { data: null, error },
  })),
  on(OverviewActions.getWordCloudSuccess, (state, { data }) => ({
    ...state,
    wordCloud: { data, error: null },
  })),
  on(OverviewActions.getWordCloudError, (state, { error }) => ({
    ...state,
    wordCloud: { data: [], error },
  })),
  on(OverviewActions.getToneByMediaSuccess, (state, { data }) => ({
    ...state,
    toneByMedia: { data, error: null },
  })),
  on(OverviewActions.getToneByMediaError, (state, { error }) => ({
    ...state,
    toneByMedia: { data: [], error },
  }))
);
