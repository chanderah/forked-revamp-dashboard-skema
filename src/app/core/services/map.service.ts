import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllCount } from '../models/all-count.model';
import { FilterRequestPayload } from '../models/request.model';
import { ArticleResponse } from '../models/article.model';
import { GEO_BASE_URL } from '../api';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private baseUrl = GEO_BASE_URL;

  constructor(private http: HttpClient) {}

  getGeoJsonData(): Observable<any> {
    return this.http.get<any>('assets/map.json');
  }

  getAllCount(filter: FilterRequestPayload): Observable<AllCount> {
    return this.http.post<AllCount>(`${this.baseUrl}/v2/all-count/`, {
      ...filter,
      maxSize: null,
      type_location: filter.type_location ?? 'article',
    });
  }

  getArticleByGeo(filter: FilterRequestPayload): Observable<ArticleResponse> {
    return this.http.post<ArticleResponse>(`${this.baseUrl}/v2/article-by-geo/`, {
      size: 10,
      page: 0,
      ...filter,
      max_size: 16,
      type_location: filter.type_location ?? 'article',
    });
  }
}
