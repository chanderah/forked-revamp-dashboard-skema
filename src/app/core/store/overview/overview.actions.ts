import { createAction, props } from '@ngrx/store';
import { MediaCount } from '../../models/media-count.model';
import { AllCount } from '../../models/all-count.model';
import { WordCloud } from '../../models/wordcloud.model';
import { ToneByMedia } from '../../models/tone-by-media.model';
import { Article } from '../../models/article.model';
import { FilterRequestPayload } from '../../models/request.model';

export const getMediaCount = createAction('[Overview] Get Media Count', props<{ filter: FilterRequestPayload }>());
export const getMediaCountSuccess = createAction('[Overview] Get Media Count Success', props<{ data: MediaCount[] }>());
export const getMediaCountError = createAction('[Overview] Get Media Count Failure', props<{ error: string }>());

export const getAllCount = createAction('[Overview] Get All Count', props<{ filter: FilterRequestPayload }>());
export const getAllCountSuccess = createAction('[Overview] Get All Count Success', props<{ data: AllCount }>());
export const getAllCountError = createAction('[Overview] Get All Count Failure', props<{ error: string }>());

export const getWordCloud = createAction('[Overview] Get Word Cloud', props<{ filter: FilterRequestPayload }>());
export const getWordCloudSuccess = createAction('[Overview] Get Word Cloud Success', props<{ data: WordCloud[] }>());
export const getWordCloudError = createAction('[Overview] Get Word Cloud Failure', props<{ error: string }>());

export const getToneByMedia = createAction('[Overview] Get Tone By Media', props<{ filter: FilterRequestPayload }>());
export const getToneByMediaSuccess = createAction('[Overview] Get Tone By Media Success', props<{ data: ToneByMedia[] }>());
export const getToneByMediaError = createAction('[Overview] Get Tone By Media Failure', props<{ error: string }>());

export const getUserEditingPlus = createAction('[Overview] Get User Editing Plus', props<{ filter: FilterRequestPayload }>());
export const getUserEditingPlusSuccess = createAction('[Overview] Get User Editing Plus Success', props<{ data: Article[] }>());
export const getUserEditingPlusError = createAction('[Overview] Get User Editing Plus Failure', props<{ error: string }>());
