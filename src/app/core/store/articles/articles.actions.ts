import { createAction, props } from '@ngrx/store';
import { FilterRequestPayload } from '../../models/request.model';
import { Article, ArticleResponse } from '../../models/article.model';

export const getMediaCountArticles = createAction(
  '[Articles] Get Media Count Articles',
  props<{ filter: { article_ids: number[]; page: number; size: number } }>()
);
export const getMediaCountArticlesSuccess = createAction('[Articles] Get Media Count Articles Success', props<{ data: ArticleResponse }>());
export const getMediaCountArticlesError = createAction('[Articles] Get Media Count Articles Failure', props<{ error: string }>());
