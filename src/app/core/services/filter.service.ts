import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoryResponse } from '../models/category.model';
import { MediaResponse } from '../models/media.model';
import { FilterState, initialState } from '../store/filter/filter.reducer';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { selectFilterState } from '../store/filter/filter.selectors';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterState: Observable<FilterState>;
  filter: FilterState = initialState;

  constructor(private store: Store<AppState>) {
    this.filterState = this.store.select(selectFilterState);
  }

  subscribe = (callback: (data: FilterState) => void) => {
    return this.filterState.subscribe((data) => {
      this.filter = data
      callback(data)
    })
  };
}
