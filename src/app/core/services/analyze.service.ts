import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterRequestPayload } from '../models/request.model';
import { MediaVisibilityResponse } from '../models/media-visibility.model';
import { TopIssueResponse } from '../models/issue.model';
import { BASE_URL } from '../api';

@Injectable({
  providedIn: 'root',
})
export class AnalyzeService {
  private baseUrl = BASE_URL;
  constructor(private http: HttpClient) {}

  getMediaVisibility(
    filter: FilterRequestPayload
  ): Observable<MediaVisibilityResponse> {
    return this.http.post<MediaVisibilityResponse>(
      `${this.baseUrl}/v1/dashboard/media-visibility`,
      {
        ...filter,
        media_id: 0,
      }
    );
  }

  getTopIssue(filter: FilterRequestPayload): Observable<TopIssueResponse> {
    return this.http.post<TopIssueResponse>(
      `${this.baseUrl}/v1/dashboard/top-issue`,
      {
        ...filter,
        media_id: 0,
      }
    );
  }
}
