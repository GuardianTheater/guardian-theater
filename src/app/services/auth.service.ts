// Adapted from https://github.com/dcaslin/d2-checklist/blob/master/src/app/service/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, from, BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: BehaviorSubject<{
    membershipId?: string;
    provider?: string;
    iat?: number;
    exp?: number;
  }>;

  constructor(private helper: JwtHelperService, private http: HttpClient) {
    this.token = new BehaviorSubject({});
    const jwt = localStorage.getItem('gtapi_access_token');
    const token = this.helper.decodeToken(jwt);
    this.token.next(token);
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http
        .post(`${environment.api.baseUrl}/auth/bungie/refresh`, {
          refreshToken,
        })
        .subscribe((res: { jwt: string; refreshToken: string }) => {
          try {
            localStorage.setItem('gtapi_access_token', res.jwt);
            localStorage.setItem('refreshToken', res.refreshToken);
          } catch (e) {
            localStorage.removeItem('gtapi_access_token');
            localStorage.removeItem('refreshToken');
          }
        });
    }
  }
}
