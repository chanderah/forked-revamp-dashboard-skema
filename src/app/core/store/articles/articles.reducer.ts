import { createReducer, on } from '@ngrx/store';
import * as OverviewActions from './articles.actions';
import { Article, ArticleResponse } from '../../models/article.model';

export interface ArticlesState {
  mediaCountArticles: {
    data: ArticleResponse | null;
    error: string | null;
    isLoading: boolean;
  };
}

export const initialState: ArticlesState = {
  mediaCountArticles: { data: null, error: null, isLoading: false },
};

export const articlesReducer = createReducer(
  initialState,
  on(OverviewActions.getMediaCountArticles, (state) => ({
    ...state,
    mediaCountArticles: { ...state.mediaCountArticles, isLoading: true },
  })),
  on(OverviewActions.getMediaCountArticlesSuccess, (state, { data }) => ({
    ...state,
    mediaCountArticles: { data, error: null, isLoading: false },
  })),
  on(OverviewActions.getMediaCountArticlesError, (state, { error }) => ({
    ...state,
    mediaCountArticles: { data: null, error, isLoading: false },
  }))
);
