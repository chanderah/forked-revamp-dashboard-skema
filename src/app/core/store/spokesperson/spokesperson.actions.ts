import { createAction, props } from '@ngrx/store';
import { FilterRequestPayload } from '../../models/request.model';
import { Influencer, InfluencerCount } from '../../models/influencer.model';
import { Article } from '../../models/article.model';

export const getInfluencerCount = createAction('[Spokesperson] Get Influencer Count', props<{ filter: FilterRequestPayload }>());
export const getInfluencerCountSuccess = createAction('[Spokesperson] Get Influencer Count Success', props<{ data: InfluencerCount[] }>());
export const getInfluencerCountError = createAction('[Spokesperson] Get Influencer Count Failure', props<{ error: string }>());

export const getInfluencer = createAction('[Spokesperson] Get Influencer', props<{ filter: FilterRequestPayload }>());
export const getInfluencerSuccess = createAction('[Spokesperson] Get Influencer Success', props<{ data: Influencer[] }>());
export const getInfluencerError = createAction('[Spokesperson] Get Influencer Failure', props<{ error: string }>());

export const getLatestNews = createAction('[Spokesperson] Get Latest News', props<{ filter: FilterRequestPayload }>());
export const getLatestNewsSuccess = createAction('[Spokesperson] Get Latest News Success', props<{ data: Article[] }>());
export const getLatestNewsError = createAction('[Spokesperson] Get Latest News Failure', props<{ error: string }>());

export const setInfluencer = createAction('[Spokesperson] Set Influencer', props<{ influencer: string }>());

export const setMedia = createAction('[Spokesperson] Set Media', props<{ media: number }>());

export const clearInfluencer = createAction('[Spokesperson] Clear Influencer');

export const clearMedia = createAction('[Spokesperson] Clear Media');
