import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { getUserFromLocalStorage } from '../../shared/utils/AuthUtils';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(public router: Router) {}

  canActivate(next: any): boolean {
    const user = getUserFromLocalStorage()
    if (!user) {
      this.router.navigateByUrl('/login');
      return false;
    }
    if (!user.menu.includes(next.url[0].path) && next.url[0].path !== 'dashboard') {
      return false;
    }
    return true;
  }
}
