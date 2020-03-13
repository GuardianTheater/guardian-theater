import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private helper: JwtHelperService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const jwt: string = params['jwt'];
      const refreshToken: string = params['refreshToken'];
      try {
        if (jwt) {
          localStorage.setItem('gtapi_access_token', jwt);
          localStorage.setItem('refreshToken', refreshToken);
          const token: {
            membershipId: string;
            provider: string;
            iat: number;
            exp: number;
          } = this.helper.decodeToken(jwt);
          this.authService.token.next(token);
          this.router.navigate(['/guardian', '254', token.membershipId]);
        } else {
          throw 'Authentication Error';
        }
      } catch (e) {
        console.error(`Authentication Error`);
      }
    });
  }
}
