import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterRequestPayload } from '../models/request.model';
import { TonesResponse } from '../models/tone.model';

@Injectable({
  providedIn: 'root',
})
export class ToneService {
  private baseUrl = 'https://api.skema.co.id/api';
  constructor(private http: HttpClient) {}

  getTones(filter: FilterRequestPayload): Observable<TonesResponse> {
    return this.http.post<TonesResponse>(`${this.baseUrl}/v1/dashboard/tones`, {
      ...filter,
      media_id: 0,
    });
  }
}
