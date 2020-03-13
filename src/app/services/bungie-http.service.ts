import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, throwError as observableThrowError } from 'rxjs';
import { ServerResponse } from 'bungie-api-ts/destiny2';
import { map, tap, switchMap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class BungieHttpService {
  public error: BehaviorSubject<ServerResponse<any>>;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.error = new BehaviorSubject(null);

    let initHeaders = new HttpHeaders();
    initHeaders = initHeaders.set('X-API-Key', environment.bungie.apiKey);
  }

  get(url: string) {
    let headers = new HttpHeaders();
    headers = headers.set('X-API-Key', environment.bungie.apiKey);
    const options = {
      headers: headers,
    };
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
        err => observableThrowError(err || 'Bungie Server error'),
      ),
    );
  }
}
