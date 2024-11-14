import { createFeatureSelector } from '@ngrx/store';
import { ArticlesState } from './articles.reducer';

export const selectArticlesState = createFeatureSelector<ArticlesState>('articles');
