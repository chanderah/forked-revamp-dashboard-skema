import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterRequestPayload } from '../models/request.model';
import {
  InfluencerCountResponse,
  InfluencerQuotes,
  InfluencerResponse,
  MediaShare,
} from '../models/influencer.model';
import { INFLUENCER_BASE_URL } from '../api';

@Injectable({
  providedIn: 'root',
})
export class InfluencerService {
  private baseUrl = INFLUENCER_BASE_URL;
  constructor(private http: HttpClient) {}

  getSpokepersons(
    filter: FilterRequestPayload
  ): Observable<InfluencerCountResponse> {
    const params = {
      start_date: filter.start_date + ' 00:00:00' ?? '',
      end_date: filter.end_date + ' 23:59:59' ?? '',
      max_size: filter.max_size ?? 20,
      page: 1,
      media_id: filter.media_id ?? 0,
      category_set: filter.category_set ?? '',
      user_media_type_id: filter.user_media_type_id ?? '',
      category_id: filter.category_id ?? 'all',
    };

    return this.http.get<InfluencerCountResponse>(
      `${this.baseUrl}/v1/spokesperson/quotes/count`,
      {
        params,
      }
    );
  }

  getSpokepersonMediaShares(
    filter: FilterRequestPayload & { spokeperson_name?: string }
  ): Observable<{
    data: { media_shares: MediaShare[]; total_doc_count: number };
  }> {
    const params = {
      start_date: filter.start_date + ' 00:00:00' ?? '',
      end_date: filter.end_date + ' 23:59:59' ?? '',
      max_size: filter.max_size ?? 20,
      page: 1,
      media_id: filter.media_id ?? 0,
      category_set: filter.category_set ?? '',
      user_media_type_id: filter.user_media_type_id ?? '',
      category_id: filter.category_id ?? 'all',
      spokesperson_name: filter.spokeperson_name ?? '',
    };

    return this.http.get<{
      data: { media_shares: MediaShare[]; total_doc_count: number };
    }>(`${this.baseUrl}/v1/spokesperson/quotes/media-shares`, {
      params,
    });
  }

  getSpokepersonQuotes(
    filter: FilterRequestPayload & {
      media_id?: number;
      spokeperson_name?: string;
    }
  ): Observable<{ data: InfluencerQuotes[] }> {
    const params = {
      start_date: filter.start_date + ' 00:00:00' ?? '',
      end_date: filter.end_date + ' 23:59:59' ?? '',
      max_size: filter.max_size ?? 20,
      page: 1,
      category_set: filter.category_set ?? '',
      user_media_type_id: filter.user_media_type_id ?? '',
      category_id: filter.category_id ?? 'all',
      media_id: filter.media_id ?? 0,
      spokesperson_name: filter.spokeperson_name ?? '',
    };

    return this.http.get<{ data: InfluencerQuotes[] }>(
      `${this.baseUrl}/v1/spokesperson/quotes`,
      {
        params,
      }
    );
  }
}
