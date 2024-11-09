import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../api';
import { RequestGetChart, RequestGetChartMentions } from '../models/social-media';

@Injectable({
  providedIn: 'root',
})
export class SocialMediaService {
  constructor(private httpClient: HttpClient) {}

  getChart(req: RequestGetChart) {
    return this.httpClient.get(`${BASE_URL}/v1/socmed/charts/${req.type}`, {
      params: {
        start_date: req.startDate,
        end_date: req.endDate,
      },
    });
  }

  getChartMentions(req: RequestGetChartMentions) {
    return this.httpClient.get<any>(`${BASE_URL}/v1/socmed/mentions`, {
      params: {
        ...req,
      },
    });
  }

  // https://api.skema.co.id/api/v1/socmed/mentions?start_date=2024-11-04&end_date=2024-11-05&keyword=96433&size=10&page=1&sources=26
  // getReachByPlatformMentions(req: RequestGetChart) {
  //   return this.httpClient.get(`${BASE_URL}/v1/socmed/charts/${req.type}`, {
  //     params: {
  //       start_date: req.startDate,
  //       end_date: req.endDate,
  //     },
  //   });
  // }
}
