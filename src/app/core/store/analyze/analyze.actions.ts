import { createAction, props } from '@ngrx/store';
import { Article } from '../../models/article.model';
import { FilterRequestPayload } from '../../models/request.model';
import { Tones } from '../../models/tone.model';
import { MediaVisibility } from '../../models/media-visibility.model';
import { ToneByCategory } from '../../models/tone-by-category.model';
import { ToneByMedia } from '../../models/tone-by-media.model';
import { TopIssueResponseData } from '../../models/issue.model';

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

export const getToneByCategory = createAction(
  '[Analyze] Get Tone By Category',
  props<{ filter: FilterRequestPayload }>()
);
export const getToneByCategorySuccess = createAction(
  '[Analyze] Get Tone By Category Success',
  props<{ data: ToneByCategory[] }>()
);
export const getToneByCategoryError = createAction(
  '[Analyze] Get Tone By Category Failure',
  props<{ error: string }>()
);

export const getToneByMedia = createAction(
  '[Analyze] Get Tone By Media',
  props<{ filter: FilterRequestPayload }>()
);
export const getToneByMediaSuccess = createAction(
  '[Analyze] Get Tone By Media Success',
  props<{ data: ToneByMedia[] }>()
);
export const getToneByMediaError = createAction(
  '[Analyze] Get Tone By Media Failure',
  props<{ error: string }>()
);

export const getTopIssue = createAction(
  '[Analyze] Get Top Issue',
  props<{ filter: FilterRequestPayload }>()
);
export const getTopIssueSuccess = createAction(
  '[Analyze] Get Top Issue Success',
  props<{ data: TopIssueResponseData }>()
);
export const getTopIssueError = createAction(
  '[Analyze] Get Top Issue Failure',
  props<{ error: string }>()
);

export const getArticlesByTone = createAction(
  '[Analyze] Get Article By Tone',
  props<{ filter: FilterRequestPayload }>()
);
export const getArticlesByToneSuccess = createAction(
  '[Analyze] Get Article By Tone Success',
  props<{ data: Article[] }>()
);
export const getArticlesByToneError = createAction(
  '[Analyze] Get Article By Tone Failure',
  props<{ error: string }>()
);