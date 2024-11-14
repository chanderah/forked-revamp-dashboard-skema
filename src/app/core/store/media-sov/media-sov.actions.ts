import { createAction, props } from '@ngrx/store';
import { MediaSOV } from '../../models/media.model';

export const setMedia = createAction('[Media Sov] Set Media', props<{ media: MediaSOV }>());

export const setTone = createAction('[Media Sov] Set Tone', props<{ tone: number }>());
