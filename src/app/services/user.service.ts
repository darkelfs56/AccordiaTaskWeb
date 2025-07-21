import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  currentUser = signal<{ email: string } | null>(null);

  registerUser(data: { email: string; password: string }) {
    const url = environment.apiUrl + '/user/register';
    return this.http.post(url, data, {
      withCredentials: true,
    });
  }

  loginUser(data: { email: string; password: string }) {
    const url = environment.apiUrl + '/auth/login';
    return this.http.post(url, data, {
      withCredentials: true,
    });
  }

  refreshAccessToken() {
    const url = environment.apiUrl + '/auth/refresh';
    return this.http.post(url, {}, { withCredentials: true });
  }

  getUser() {
    const url = environment.apiUrl + '/auth/user';
    return this.http.get(url, { withCredentials: true });
  }

  logout() {
    const url = environment.apiUrl + '/auth/logout';
    return this.http.post(url, {}, { withCredentials: true });
  }

  constructor() {}
}
