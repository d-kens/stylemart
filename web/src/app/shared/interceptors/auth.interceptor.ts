// src/app/interceptors/auth.interceptor.ts

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/data-access/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const excludedUrls = ['/auth/register', '/auth/login'];

    const isExcludedUrl = excludedUrls.some(url => request.url.includes(url));

    if (isExcludedUrl) {
      console.log("REQUEST NOT INTERCEPTED: " + request.url);
      return next.handle(request);
    }

    // Get the access token from localStorage
    const accessToken = localStorage.getItem('authToken');

    // Clone the request and add the Authorization header
    const clonedRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${accessToken}`),
      withCredentials: true,
    });

    return next.handle(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap((response) => {
              console.log("REFRESH TOKEN RESPONSE", response)
              // Assuming the response contains the new access token
              const newAccessToken = response.accessToken;
              this.authService.storeAccessToken(newAccessToken); // Store the new access token

              // Retry the original request with the new access token
              const retryRequest = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${newAccessToken}`),
              });
              return next.handle(retryRequest);
            }),
            catchError((refreshError) => {
              this.authService.logout();
              this.router.navigate(['/auth/sign-in']);
              return throwError(() => new Error('Refresh token expired'));
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
