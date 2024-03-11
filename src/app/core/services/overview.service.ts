import { Injectable } from '@angular/core';
import { Observable, filter, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MediaCount } from '../models/media-count.model';
import { AllCount } from '../models/all-count.model';
import { WordCloudResponse } from '../models/wordcloud.model';
import { ToneByMediaResponse } from '../models/tone-by-media.model';
import { HighlightsResponse } from '../models/highlights.model';
import { FilterRequestPayload } from '../models/request.model';
import { initialState as storeFilterInitialState } from '../store/filter/filter.reducer';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  private baseUrl = 'https://api.skema.co.id/api';
  private geoBaseUrl = 'https://api-geo.skema.co.id/api';
  constructor(private http: HttpClient) {}

  getMediaCount(
    filter: FilterRequestPayload
  ): Observable<{ data: MediaCount[] }> {
    return this.http.post<{ data: MediaCount[] }>(
      `${this.baseUrl}/v1/dashboard/media-count`,
      {
        ...filter,
        user_media_type_id: 0,
      }
    );
  }

  getAllCount(): Observable<AllCount> {
    return this.http.post<AllCount>(`${this.geoBaseUrl}/v2/all-count/`, {
      category_set: 0,
      category_id: 'all',
      user_media_type_id: 0,
      media_id: '0',
      start_date: '2023-12-22',
      end_date: '2023-12-23',
      date_type: 'yesterday',
      type_location: 'article',
    });
  }

  getWordCloud(): Observable<WordCloudResponse> {
    return this.http.post<WordCloudResponse>(
      `${this.baseUrl}/v2/dashboard/wordcloud`,
      {
        category_set: 0,
        category_id: 'all',
        user_media_type_id: 0,
        media_id: '0',
        start_date: '2024-03-08',
        end_date: '2024-03-09',
        date_type: 'yesterday',
        total_word: 40,
      }
    );
  }

  getToneByMedia(): Observable<ToneByMediaResponse> {
    return this.http.post<ToneByMediaResponse>(
      `${this.baseUrl}/v1/dashboard/tone-by-media`,
      {
        category_set: 0,
        category_id: 'all',
        user_media_type_id: 0,
        media_id: '0',
        start_date: '2024-03-08',
        end_date: '2024-03-09',
        date_type: 'yesterday',
      }
    );
  }

  getHighlights(): Observable<HighlightsResponse> {
    return this.http.post<HighlightsResponse>(
      `${this.baseUrl}/v1/dashboard/high-lights`,
      {
        category_set: 0,
        category_id: 'all',
        user_media_type_id: 0,
        media_id: '0',
        start_date: '2024-03-08',
        end_date: '2024-03-09',
        date_type: 'yesterday',
      }
    );
  }
}
