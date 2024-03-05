import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getUserFromLocalStorage } from '../../shared/utils/AuthUtils';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(public router: Router) {}

  canActivate(): boolean {
    if (!getUserFromLocalStorage()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
