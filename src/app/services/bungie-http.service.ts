import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  throwError as observableThrowError
} from 'rxjs';
import { ServerResponse } from 'bungie-api-ts/destiny2';
import { map, tap, switchMap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class BungieHttpService {
  public error: BehaviorSubject<ServerResponse<any>>;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.error = new BehaviorSubject(null);

      case 'https://d1.guardian.theater':
        this._apiKey = '97c176d9f0f144f0b70bb69a455234a6';
        break;

      case 'https://guardian.theater':
        this._apiKey = 'fc91f657672b41189d2682be8eb51697';
        break;
    }
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('x-api-key', this._apiKey);
  }

  get(url: string) {
    return this.authService.getKey().pipe(map(key => {
      try {
        if (key == null) {
          let headers = new HttpHeaders();
          headers = headers.set('X-API-Key', environment.bungie.apiKey);
          return {
            headers: headers
          };
        } else {
          let headers = new HttpHeaders();
          headers = headers
            .set('X-API-Key', environment.bungie.apiKey)
            .set('Authorization', 'Bearer ' + key);
          return {
            headers: headers
          };
        }
      } catch (err) {
        console.dir(err);
        let headers = new HttpHeaders();
        headers = headers.set('X-API-Key', environment.bungie.apiKey);
        return {
          headers: headers
        };
      }
    }),
    switchMap (options => {
      return this.http.get(url, options).pipe(
        tap(
          (res: ServerResponse<any>) => {
            if (
              res &&
              res.Response &&
              res.Response.ErrorCode &&
              res.Response.ErrorCode !== 1
            ) {
              this.error.next(res);
            }
          },
          err => observableThrowError(err || 'Bungie Server error')
        )
      );
    }))
  }
}
