import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { NewUser, User } from '../models/user.model';

const baseUrl = environment.auth.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  registerUser(userData: NewUser): Observable<User> {
    return this.http.post<User>(`${baseUrl}/register`, userData)
  }

  
}
