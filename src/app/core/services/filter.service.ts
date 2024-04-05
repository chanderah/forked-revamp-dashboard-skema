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
  private baseUrl = 'https://api.skema.co.id/api';
  filterState: Observable<FilterState>;
  filter: FilterState = initialState;

  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.filterState = this.store.select(selectFilterState);
  }

  subscribe = (callback: (data: FilterState) => void) => {
    return this.filterState.subscribe((data) => {
      this.filter = data
      callback(data)
    })
  };

  getCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(
      `${this.baseUrl}/v1/user/categories/`
    );
  }

  getSubCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(
      `${this.baseUrl}/v1/user/subcategories/0`
    );
  }

  getMedias(): Observable<MediaResponse> {
    return this.http.get<MediaResponse>(`${this.baseUrl}/v1/user/medias/`);
  }
}
