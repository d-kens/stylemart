import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RegReqObject } from '../models/auth.model';
import { AuthReqObject } from '../models/auth.model';
import { User } from '../models/user.model';

const baseUrl = environment.auth.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  registerUser(userData: RegReqObject): Observable<User> {
    return this.http.post<User>(`${baseUrl}/register`, userData)
  }

  login(userData: AuthReqObject): Observable<string> {
    return this.http.post<string>(`${baseUrl}/login`, userData)
  }

  refreshToken(): Observable<string> {
    return this.http.post<string>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
  }

  logout(): Observable<string> {
    return this.http.post<string>(`${baseUrl}/logout`, {})
  } 

  getAuthenticatedUser(): Observable<User> {
    return this.http.get<User>(`${baseUrl}/user`)
  }

}
