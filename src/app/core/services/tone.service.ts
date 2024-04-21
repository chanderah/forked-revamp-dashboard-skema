import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterRequestPayload } from '../models/request.model';
import { TonesResponse } from '../models/tone.model';
import { ToneByCategoryResponse } from '../models/tone-by-category.model';
import { ToneByMediaResponse } from '../models/tone-by-media.model';
import { BASE_URL } from '../api';

@Injectable({
  providedIn: 'root',
})
export class ToneService {
  private baseUrl = BASE_URL
  constructor(private http: HttpClient) {}

  getTones(filter: FilterRequestPayload): Observable<TonesResponse> {
    return this.http.post<TonesResponse>(`${this.baseUrl}/v1/dashboard/tones`, {
      ...filter,
      media_id: 0,
    });
  }

  getToneByCategory(filter: FilterRequestPayload): Observable<ToneByCategoryResponse> {
    return this.http.post<ToneByCategoryResponse>(`${this.baseUrl}/v1/dashboard/tone-by-category`, {
      ...filter,
      media_id: 0,
    });
  }

  getToneByMedia(
    filter: FilterRequestPayload
  ): Observable<ToneByMediaResponse> {
    return this.http.post<ToneByMediaResponse>(
      `${this.baseUrl}/v1/dashboard/tone-by-media`,
      {
        ...filter,
        media_id: 0,
      }
    );
  }
}
