import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MediaCount } from '../../models/media-count.model';
import { AllCount } from '../../models/all-count.model';
import { WordCloudResponse } from '../../models/wordcloud.model';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  private baseUrl = 'https://api.skema.co.id/api';
  private geoBaseUrl = 'https://api-geo.skema.co.id/api';
  constructor(private http: HttpClient) {}

  getMediaCount(): Observable<{ data: MediaCount[] }> {
    return this.http.post<{ data: MediaCount[] }>(
      `${this.baseUrl}/v1/dashboard/media-count`,
      {
        category_set: 0,
        category_id: 'all',
        user_media_type_id: 0,
        media_id: '0',
        start_date: '2023-12-22',
        end_date: '2023-12-23',
        date_type: 'yesterday',
      }
    );
  }

  getAllCount(): Observable<AllCount> {
    return this.http.post<AllCount>(`${this.geoBaseUrl}/v2/all-count`, {
      category_set: 0,
      category_id: 'all',
      user_media_type_id: 0,
      media_id: '0',
      start_date: '2023-12-22',
      end_date: '2023-12-23',
      date_type: 'yesterday',
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
}
