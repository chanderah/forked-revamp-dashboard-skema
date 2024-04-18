import { createReducer, on } from '@ngrx/store';
import * as Actions from './media-sov.actions';
import { MediaSOV } from '../../models/media.model';

export interface MediaSOVState {
  media: MediaSOV | null;
  tone: number | null;
}

export const initialState: MediaSOVState = {
  media: null,
  tone: null,
};

export const mediaSOVReducer = createReducer(
  initialState,
  on(Actions.setMedia, (state, { media }) => {
    return { ...state, media };
  }),
  on(Actions.setTone, (state, { tone }) => {
    return { ...state, tone };
  })
);
