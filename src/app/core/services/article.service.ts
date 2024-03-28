import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HighlightsResponse } from '../models/highlights.model';
import { FilterRequestPayload } from '../models/request.model';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private baseUrl = 'https://api.skema.co.id/api';
  constructor(private http: HttpClient) {}

  getHighlights(filter: FilterRequestPayload): Observable<HighlightsResponse> {
    return this.http.post<HighlightsResponse>(
      `${this.baseUrl}/v1/dashboard/high-lights`,
      {
        ...filter,
        media_id: 0,
      }
    );
  }

  getUserEditingPlus(
    filter: FilterRequestPayload
  ): Observable<{ data: Article[] }> {
    return this.http.post<{ data: Article[] }>(
      `${this.baseUrl}/v1/user/editingplus/`,
      {
        ...filter,
        media_id: 0,
        maxSize: 20,
        page: 0,
      }
    );
  }

  getArticlesByTone(
    filter: FilterRequestPayload
  ): Observable<{ data: Article[] }> {
    return this.http.post<{ data: Article[] }>(
      `${this.baseUrl}/v1/dashboard/article-by-tone`,
      {
        ...filter,
        media_id: 0,
        maxSize: 20,
        page: 0,
      }
    );
  }
}
