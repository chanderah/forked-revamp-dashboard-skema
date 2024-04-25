import { createReducer, on } from '@ngrx/store';
import * as SpokespersonActions from './spokesperson.actions';
import { Influencer, InfluencerCount } from '../../models/influencer.model';
import { Article } from '../../models/article.model';

export interface SpokespersonState {
  influencerCount: {
    data: InfluencerCount[];
    error: string | null;
    isLoading: boolean;
  };
  influencer: {
    data: Influencer[];
    error: string | null;
    isLoading: boolean;
  };
  latestNews: {
    data: Article[];
    error: string | null;
    isLoading: boolean;
  };
  selectedInfluencer: string | null;
  selectedMedia: number | null;
}

export const initialState: SpokespersonState = {
  influencerCount: { data: [], error: null, isLoading: false },
  influencer: { data: [], error: null, isLoading: false },
  latestNews: { data: [], error: null, isLoading: false },
  selectedInfluencer: null,
  selectedMedia: null,
};

export const spokespersonReducer = createReducer(
  initialState,
  on(SpokespersonActions.getInfluencerCount, (state) => ({
    ...state,
    influencerCount: { ...state.influencerCount, isLoading: true },
  })),
  on(SpokespersonActions.getInfluencerCountSuccess, (state, { data }) => ({
    ...state,
    influencerCount: { data, error: null, isLoading: false },
  })),
  on(SpokespersonActions.getInfluencerCountError, (state, { error }) => ({
    ...state,
    influencerCount: { data: [], error, isLoading: false },
  })),

  on(SpokespersonActions.getInfluencer, (state) => ({
    ...state,
    influencer: { ...state.influencer, isLoading: true },
  })),
  on(SpokespersonActions.getInfluencerSuccess, (state, { data }) => ({
    ...state,
    influencer: { data, error: null, isLoading: false },
  })),
  on(SpokespersonActions.getInfluencerError, (state, { error }) => ({
    ...state,
    influencer: { data: [], error, isLoading: false },
  })),

  on(SpokespersonActions.getLatestNews, (state) => ({
    ...state,
    latestNews: { ...state.latestNews, isLoading: true },
  })),
  on(SpokespersonActions.getLatestNewsSuccess, (state, { data }) => ({
    ...state,
    latestNews: { data, error: null, isLoading: false },
  })),
  on(SpokespersonActions.getLatestNewsError, (state, { error }) => ({
    ...state,
    latestNews: { data: [], error, isLoading: false },
  })),

  on(SpokespersonActions.setInfluencer, (state, { influencer }) => ({
    ...state,
    selectedInfluencer: influencer,
  })),

  on(SpokespersonActions.setMedia, (state, { media }) => ({
    ...state,
    selectedMedia: media,
  }))
);
