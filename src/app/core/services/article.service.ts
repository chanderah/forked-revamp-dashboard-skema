import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HighlightsResponse } from '../models/highlights.model';
import { FilterRequestPayload } from '../models/request.model';
import { Article, ArticleResponse } from '../models/article.model';

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

  getUserEditing(filter: FilterRequestPayload): Observable<ArticleResponse> {
    return this.http.post<ArticleResponse>(`${this.baseUrl}/v1/user/editing/`, {
      ...filter,
      media_id: 0,
      maxSize: 20,
      page: 0,
    });
  }

  getArticlesByTone(
    filter: FilterRequestPayload
  ): Observable<{ data: Article[] }> {
    return this.http.post<{ data: Article[] }>(
      `${this.baseUrl}/v1/dashboard/article-by-tone`,
      {
        ...filter,
        media_id: 0,
        page: 0,
      }
    );
  }

  getMediaCountArticles({
    article_ids,
    page,
    size,
  }: {
    article_ids: number[];
    page: number;
    size: number;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/v1/dashboard/media-count/articles`,
      {
        article_ids,
        page,
        size,
      }
    );
  }

  getArticleById(articleId: string): Observable<{ data: Article }> {
    return this.http.get<{ data: Article }>(
      `${this.baseUrl}/v1/user/article/${articleId}`
    );
  }

  getKeywordsByArticleId(articleId: string): Observable<{ data: string[] }> {
    return this.http.post<{ data: string[] }>(
      `${this.baseUrl}/v1/user/keywords-by-article-id/`,
      { article_id: articleId }
    );
  }
}
