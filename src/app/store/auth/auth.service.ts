import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login(username: string, password: string): Observable<any> {
    if (username === 'admin' && password === 'password') {
      return of({ token: 'your-auth-token' });
    } else {
      throw new Error('Invalid username or password');
    }
  }
}
