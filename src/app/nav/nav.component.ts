import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event } from '@angular/router';
import { BungieHttpService } from '../services/bungie-http.service';
import { Subscription, from, Observable, BehaviorSubject } from 'rxjs';
import { ServerResponse, BungieMembershipType } from 'bungie-api-ts/destiny2';
import { SettingsService } from '../services/settings.service';
import { AuthService } from 'app/services/auth.service';
import { map, take } from 'rxjs/operators';
import { UserMembershipData } from 'bungie-api-ts/user';
import {
  faTshirt,
  faCoffee,
  faInfoCircle,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import {
  faDiscord,
  faTwitter,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { environment } from 'environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  faInfoCircle = faInfoCircle;
  faWrench = faWrench;
  faCoffee = faCoffee;
  faTshirt = faTshirt;
  faDiscord = faDiscord;
  faTwitter = faTwitter;
  faGithub = faGithub;
  public searchString: string;
  public ad: boolean;
  public betaTextHidden: {
    hidden?: boolean;
  };
  public errorRes: ServerResponse<any>;
  public dark: boolean;

  private _errorRes$: Subscription;
  private _routerEvent$: Subscription;

  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private bHttp: BungieHttpService,
    public authService: AuthService,
    private helper: JwtHelperService,
  ) {}

  ngOnInit() {
    this.searchString = '';

    this.settingsService.dark.subscribe(dark => (this.dark = dark));
    this._routerEvent$ = this.router.events.subscribe((event: Event) => {
      this.errorRes = null;
    });
    this._errorRes$ = this.bHttp.error.subscribe(res => (this.errorRes = res));

    this.betaTextHidden = JSON.parse(
      localStorage.getItem('gt.hideBetaText'),
    ) || {
      hidden: false,
    };
  }

  ngOnDestroy() {
    this._routerEvent$.unsubscribe();
    this._errorRes$.unsubscribe();
  }

  search() {
    if (this.searchString.length) {
      this.router.navigate(['/search', this.searchString]);
    }
  }

  route(route: any[]) {
    this.router.navigate(route);
  }

  hideBetaText() {
    this.betaTextHidden.hidden = true;
    localStorage.setItem(
      'gt.hideBetaText',
      JSON.stringify(this.betaTextHidden),
    );
  }

  login(force: boolean) {
    const url = `${environment.api.baseUrl}/auth/bungie`;
    window.location.href = url;
  }

  getMembershipsForCurrentUser(): Observable<
    ServerResponse<UserMembershipData>
  > {
    const url = `https://stats.bungie.net/Platform/User/GetMembershipsForCurrentUser/`;
    return this.bHttp.get(url);
  }

  logout() {
    localStorage.removeItem('gtapi_access_token');
    localStorage.removeItem('refreshToken');
    this.authService.token.next({});
  }

  currentProfile() {
    try {
      const jwt = localStorage.getItem('gtapi_access_token');
      const token = this.helper.decodeToken(jwt);
      this.router.navigate(['/guardian', '254', token.membershipId]);
    } catch (e) {}
  }
}
