import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WartawanMedia } from '../models/media.model';
import { BASE_URL } from '../api';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private baseUrl = BASE_URL
  constructor(private http: HttpClient) {}

  getMedias(): Observable<{ results: WartawanMedia[] }> {
    return this.http.get<{ results: WartawanMedia[] }>(
      `${this.baseUrl}/v1/wartawan/medias`
    );
  }

  sendEmail(payload: {
    content: string;
    editorial_desk: string;
    headline: string;
    subline: string;
    client_email?: string;
    images?: { base64: string; filename: string }[];
    media_names?: string[];
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/v1/wartawan/upload`,
      payload
    );
  }
}
