import { Injectable } from '@angular/core';
import { LoginRequest } from './models/login-request.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from './models/login-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from './models/user.model';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { RegisterRequest } from './models/register-request.model';
import { RegisterResponse } from './models/register-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient, private cookieService: CookieService) {

  }

  register(request:RegisterRequest): Observable<RegisterResponse>{
    return this.http.post<RegisterResponse>(`${environment.apiBaseUrl}/api/auth/register`, {
      firstName:request.firstName,
      lastName: request.lastName,
      email: request.email,
      password: request.password
    });
      
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/login`, {
      email: request.email,
      password: request.password
    });
  }

  setUser(user: User): void {

    this.$user.next(user);

    localStorage.setItem('user-email', user.email);
    localStorage.setItem('user-roles', user.roles.join(','));

    if (user.firstName !== null && user.firstName !== undefined) {
      localStorage.setItem('user-firstname', user.firstName);
    }
    if (user.lastName !== null && user.lastName !== undefined) {
      localStorage.setItem('user-lastname', user.lastName);
    }
  }

  user(): Observable<User | undefined> {
    return this.$user.asObservable();
  }

  getUser(): User | undefined {
    const email = localStorage.getItem('user-email');
    const roles = localStorage.getItem('user-roles');
    const firstName = localStorage.getItem('user-firstname');
    const lastName = localStorage.getItem('user-lastname');

    if (email && roles) {
      const user: User = {
        email: email,
        roles: roles.split(','),
        firstName: firstName,
        lastName: lastName
      };

      return user;
    }
    return undefined;
  }

  logout(): void {
    localStorage.clear();
    this.cookieService.delete('Authorization', '/');
    this.$user.next(undefined);
  }
}
