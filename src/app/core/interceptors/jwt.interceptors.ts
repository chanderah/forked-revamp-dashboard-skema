import { HttpInterceptorFn } from '@angular/common/http';
import { getUserFromLocalStorage } from '../../shared/utils/AuthUtils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('login')) return next(req);

  const currentUser = getUserFromLocalStorage();
  if (!currentUser) throw new Error('Unauthorized access');

  if (currentUser && currentUser.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Token ${currentUser.token}`,
      },
    });
  }

  return next(req);
};
