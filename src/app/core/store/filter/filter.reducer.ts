import { createReducer, on } from '@ngrx/store';
import * as FilterActions from './filter.actions';
import moment from 'moment';

export interface FilterState {
  date_type: string;
  category_id: string;
  category_set: number;
  user_media_type_id: number;
  start_date: string;
  end_date: string;
  maxSize?: number;
}

export const initialState: FilterState = {
  date_type: 'yesterday',
  start_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  end_date: moment().format('YYYY-MM-DD'),
  category_id: 'all',
  category_set: 0,
  user_media_type_id: 0,
  maxSize: 20,
};

export const filterReducer = createReducer(
  initialState,
  on(FilterActions.setFilter, (state, { filter }) => {
    return { ...filter };
  })
);
