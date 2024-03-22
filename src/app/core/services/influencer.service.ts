import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterRequestPayload } from '../models/request.model';
import {
  InfluencerCountResponse,
  InfluencerResponse,
} from '../models/influencer.model';

@Injectable({
  providedIn: 'root',
})
export class InfluencerService {
  private baseUrl = 'https://api-influencer.skema.co.id/api';
  constructor(private http: HttpClient) {}

  getInfluencerCount(
    filter: FilterRequestPayload
  ): Observable<InfluencerCountResponse> {
    return this.http.post<InfluencerCountResponse>(
      `${this.baseUrl}/v1/influencer-count-by-aliases/`,
      {
        ...filter,
        media_id: 0,
        limit: 20,
        max_size: 20,
        page: 0,
      }
    );
  }

  getInfluencer(filter: FilterRequestPayload): Observable<InfluencerResponse> {
    return this.http.post<InfluencerResponse>(
      `${this.baseUrl}/v1/influencer/`,
      {
        ...filter,
        media_id: 0,
        max_size: 20,
        page: 0,
      }
    );
  }
}
