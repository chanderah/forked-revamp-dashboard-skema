import { createFeatureSelector } from '@ngrx/store';
import { MediaSOVState } from './media-sov.reducer';

export const selectMediaSOVState = createFeatureSelector<MediaSOVState>('mediaSov');
