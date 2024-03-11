import { createReducer, on } from '@ngrx/store';
import * as FilterActions from './filter.actions';
import moment from 'moment';

export interface FilterState {
  date_type: string;
  category_id: string;
  category_set: number;
  media_id: string;
  start_date?: string;
  end_date?: string;
}

export const initialState: FilterState = {
  date_type: 'yesterday',
  start_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  end_date: moment().format('YYYY-MM-DD'),
  category_id: 'all',
  category_set: 0,
  media_id: '0',
};

export const filterReducer = createReducer(
  initialState,
  on(FilterActions.setFilter, (state, { filter }) => {
    return { ...filter };
  })
);
