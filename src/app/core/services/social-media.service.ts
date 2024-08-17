import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../api';
import { RequestGetChart } from '../models/social-media';

@Injectable({
  providedIn: 'root',
})
export class SocialMediaService {
  constructor(private httpClient: HttpClient) {}

  getChart(req: RequestGetChart) {
    return this.httpClient.get(`${BASE_URL}/v1/socmed/charts/${req.type}`, {
      params: {
        start_date: '2024-01-01',
        end_date: '2024-01-02',
      },
    });
  }
}
