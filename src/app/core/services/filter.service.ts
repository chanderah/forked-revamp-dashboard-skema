import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoryResponse } from '../models/category.model';
import { MediaResponse } from '../models/media.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private baseUrl = 'https://api.skema.co.id/api';
  constructor(private http: HttpClient) {}

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
    return this.http.get<MediaResponse>(
      `${this.baseUrl}/v1/user/medias/`
    );
  }
}
