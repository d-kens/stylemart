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
    
    const clonedRequest = request.clone({
      withCredentials: true, 
    });

    return next.handle(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              return next.handle(clonedRequest);
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
