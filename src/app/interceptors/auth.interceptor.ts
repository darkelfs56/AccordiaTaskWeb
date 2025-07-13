import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, catchError, of, switchMap, throwError } from "rxjs";
import { UserService } from "../services/user.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const authReq = req.clone({ withCredentials: true });

  if(req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next.handle(req);
  }
  const isRefreshingRequest = req.url.includes('/auth/refresh');
  return next.handle(authReq).pipe(
    catchError(err => {
      if (err.status === 401 && !isRefreshingRequest) {
        return this.userService.refreshAccessToken().pipe(
          switchMap(() => {
            return next.handle(authReq);
          }),
          catchError(refreshErr => {
            console.error('Refresh token failed:', refreshErr);
            this.userService.currentUser.set(null);
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
}

}
