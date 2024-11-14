import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MediaCount } from '../models/media-count.model';
import { AllCount } from '../models/all-count.model';
import { WordCloudResponse } from '../models/wordcloud.model';
import { ToneByMediaResponse } from '../models/tone-by-media.model';
import { HighlightsResponse } from '../models/highlights.model';
import { FilterRequestPayload } from '../models/request.model';
import { BASE_URL, GEO_BASE_URL } from '../api';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  private baseUrl = BASE_URL;
  private geoBaseUrl = GEO_BASE_URL;
  constructor(private http: HttpClient) {}

  getMediaCount(filter: FilterRequestPayload): Observable<{ data: MediaCount[] }> {
    return this.http.post<{ data: MediaCount[] }>(`${this.baseUrl}/v1/dashboard/media-count`, {
      ...filter,
      media_id: 0,
    });
  }

  getAllCount(filter: FilterRequestPayload): Observable<AllCount> {
    return this.http.post<AllCount>(`${this.geoBaseUrl}/v2/all-count/`, {
      ...filter,
      media_id: 0,
      type_location: 'article',
    });
  }

  getWordCloud(filter: FilterRequestPayload): Observable<WordCloudResponse> {
    return this.http.post<WordCloudResponse>(`${this.baseUrl}/v2/dashboard/wordcloud`, {
      ...filter,
      media_id: 0,
      total_word: 40,
    });
  }
}
