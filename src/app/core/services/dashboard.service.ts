import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getUserFromLocalStorage } from '../../shared/utils/AuthUtils';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = 'https://api.skema.co.id';

  constructor(private http: HttpClient) {}

  getLogo(): Observable<any> {
    const user = getUserFromLocalStorage();
    return this.http.get<any>(`${this.baseUrl}/media/${user?.comp_icon}`);
  }
}
