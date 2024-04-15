import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WartawanMedia } from '../models/media.model';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private baseUrl = 'https://api.skema.co.id/api';
  constructor(private http: HttpClient) {}

  getMedias(): Observable<{ results: WartawanMedia[] }> {
    return this.http.get<{ results: WartawanMedia[] }>(
      `${this.baseUrl}/v1/wartawan/medias`
    );
  }
}
