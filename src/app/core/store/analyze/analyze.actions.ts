import { createAction, props } from '@ngrx/store';
import { Article } from '../../models/article.model';
import { FilterRequestPayload } from '../../models/request.model';
import { Tones } from '../../models/tone.model';
import { MediaVisibility } from '../../models/media-visibility.model';

export const getHighlights = createAction(
  '[Analyze] Get Highlights',
  props<{ filter: FilterRequestPayload }>()
);
export const getHighlightsSuccess = createAction(
  '[Analyze] Get Highlights Success',
  props<{ data: Article[] }>()
);
export const getHighlightsError = createAction(
  '[Analyze] Get Highlights Failure',
  props<{ error: string }>()
);

export const getTones = createAction(
  '[Analyze] Get Tones',
  props<{ filter: FilterRequestPayload }>()
);
export const getTonesSuccess = createAction(
  '[Analyze] Get Tones Success',
  props<{ data: Tones }>()
);
export const getTonesError = createAction(
  '[Analyze] Get Tones Failure',
  props<{ error: string }>()
);

export const getMediaVisibility = createAction(
  '[Analyze] Get Media Visibility',
  props<{ filter: FilterRequestPayload }>()
);
export const getMediaVisibilitySuccess = createAction(
  '[Analyze] Get Media Visibility Success',
  props<{ data: MediaVisibility[] }>()
);
export const getMediaVisibilityError = createAction(
  '[Analyze] Get Media Visibility Failure',
  props<{ error: string }>()
);
