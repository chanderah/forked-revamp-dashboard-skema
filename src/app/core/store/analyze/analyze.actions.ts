import { createAction, props } from '@ngrx/store';
import { Article } from '../../models/article.model';
import { FilterRequestPayload } from '../../models/request.model';
import { Tones } from '../../models/tone.model';

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
