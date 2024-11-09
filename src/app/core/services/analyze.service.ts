import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { BASE_URL } from '../api';
import { TopIssueResponse } from '../models/issue.model';
import { MediaVisibilityResponse } from '../models/media-visibility.model';
import { FilterRequestPayload } from '../models/request.model';

@Injectable({
  providedIn: 'root',
})
export class AnalyzeService {
  private baseUrl = BASE_URL;
  constructor(private http: HttpClient) {}

  getMediaVisibility(filter: FilterRequestPayload): Observable<MediaVisibilityResponse> {
    const startDate = new Date(filter.start_date!).getDate();
    const endDate = new Date(filter.end_date!).getDate();
    if (startDate === endDate) return this.getMediaVisibilityV3(filter);

    return this.http.post<MediaVisibilityResponse>(`${this.baseUrl}/v1/dashboard/media-visibility`, {
      ...filter,
      media_id: 0,
    });
  }

  getMediaVisibilityV3(filter: FilterRequestPayload): Observable<MediaVisibilityResponse> {
    return this.http.post<MediaVisibilityResponse>(`${this.baseUrl}/v3/dashboard/media-visibility`, {
      ...filter,
      start_date: moment(filter.start_date).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      end_date: moment(filter.end_date).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  getTopIssue(filter: FilterRequestPayload): Observable<TopIssueResponse> {
    return this.http.post<TopIssueResponse>(`${this.baseUrl}/v1/dashboard/top-issue`, {
      ...filter,
      limit: 10,
      media_id: 0,
    });
  }

  downloadPPT(images: string[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/v1/user/downloads/pptx`, images);
  }

  downloadExcel(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/v1/dashboard/download-excel`, payload);
  }
}
