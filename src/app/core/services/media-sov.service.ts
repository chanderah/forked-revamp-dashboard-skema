import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MediaSOV, MediaTone } from '../models/media.model';
import { FilterRequestPayload } from '../models/request.model';
import { Article } from '../models/article.model';
import { BASE_URL } from '../api';

@Injectable({
  providedIn: 'root',
})
export class MediaSOVService {
  private baseUrl = BASE_URL;
  constructor(private http: HttpClient) {}

  getMedias(filter: FilterRequestPayload): Observable<{ data: MediaSOV[] }> {
    const params = {
      start_date: filter.start_date ?? '',
      end_date: filter.end_date ?? '',
      max_size: filter.max_size ?? 20,
      page: 1,
      media_id: filter.media_id ?? '',
      category_set: filter.category_set ?? '',
      user_media_type_id: filter.user_media_type_id ?? '',
    };

    return this.http.get<{ data: MediaSOV[] }>(
      `${this.baseUrl}/v1/media-sov/media-list`,
      { params }
    );
  }

  getLatestArticles(
    filter: FilterRequestPayload
  ): Observable<{ data: { data: Article[] } }> {
    const params = {
      start_date: filter.start_date ?? '',
      end_date: filter.end_date ?? '',
      max_size: filter.max_size ?? 6,
      page: 1,
      media_id: filter.media_id ?? '',
      category_set: filter.category_set ?? '',
      user_media_type_id: filter.user_media_type_id ?? '',
      orderBy: filter.order_by ?? '',
      tone: filter.tone ?? '',
    };

    return this.http.get<{ data: { data: Article[] } }>(
      `${this.baseUrl}/v1/media-sov/latest-articles`,
      { params }
    );
  }

  getMediaTones(filter: FilterRequestPayload): Observable<{ data: MediaTone }> {
    const params = {
      start_date: filter.start_date ?? '',
      end_date: filter.end_date ?? '',
      media_id: filter.media_id ?? '',
      category_set: filter.category_set ?? '',
      user_media_type_id: filter.user_media_type_id ?? '',
    };

    return this.http.get<{ data: MediaTone }>(
      `${this.baseUrl}/v1/media-sov/media-tones`,
      { params }
    );
  }
}
