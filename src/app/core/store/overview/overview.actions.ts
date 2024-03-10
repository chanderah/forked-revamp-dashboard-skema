import { createAction, props } from '@ngrx/store';
import { MediaCount } from '../../models/media-count.model';
import { AllCount } from '../../models/all-count.model';
import { WordCloud } from '../../models/wordcloud.model';
import { ToneByMedia } from '../../models/tone-by-media.model';
import { Article } from '../../models/article.model';

export const getMediaCount = createAction('[Overview] Get Media Count');
export const getMediaCountSuccess = createAction(
  '[Overview] Get Media Count Success',
  props<{ data: MediaCount[] }>()
);
export const getMediaCountError = createAction(
  '[Overview] Get Media Count Failure',
  props<{ error: string }>()
);

export const getAllCount = createAction('[Overview] Get All Count');
export const getAllCountSuccess = createAction(
  '[Overview] Get All Count Success',
  props<{ data: AllCount }>()
);
export const getAllCountError = createAction(
  '[Overview] Get All Count Failure',
  props<{ error: string }>()
);

export const getWordCloud = createAction('[Overview] Get Word Cloud');
export const getWordCloudSuccess = createAction(
  '[Overview] Get Word Cloud Success',
  props<{ data: WordCloud[] }>()
);
export const getWordCloudError = createAction(
  '[Overview] Get Word Cloud Failure',
  props<{ error: string }>()
);

export const getToneByMedia = createAction('[Overview] Get Tone By Media');
export const getToneByMediaSuccess = createAction(
  '[Overview] Get Tone By Media Success',
  props<{ data: ToneByMedia[] }>()
);
export const getToneByMediaError = createAction(
  '[Overview] Get Tone By Media Failure',
  props<{ error: string }>()
);

export const getHighlights = createAction('[Overview] Get Highlights');
export const getHighlightsSuccess = createAction(
  '[Overview] Get Highlights Success',
  props<{ data: Article[] }>()
);
export const getHighlightsError = createAction(
  '[Overview] Get Highlights Failure',
  props<{ error: string }>()
);