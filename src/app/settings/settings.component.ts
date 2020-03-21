import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { SettingsService } from '../services/settings.service';
import { Subscription } from 'rxjs';
import { gt } from '../gt.typings';
import { GtApiService, LinkedAccount } from 'app/services/gtApi.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private _subLinks: Subscription;
  private _subDark: Subscription;

  public links: gt.Links;
  public dark: boolean;
  loadingLinkedAccounts: boolean;
  linkedAccounts: LinkedAccount[];
  jwt: string;
  twitchLinkExists: boolean;

  constructor(
    public settingsService: SettingsService,
    private location: Location,
    private gtApiService: GtApiService,
  ) {}

  ngOnInit() {
    this._subLinks = this.settingsService.links.subscribe(links => {
      this.links = links;
    });
    this._subDark = this.settingsService.dark.subscribe(
      dark => (this.dark = dark),
    );
    this.twitchLinkExists = false;
    this.jwt = localStorage.getItem('gtapi_access_token');
    this.loadLinkedAccounts();
  }

  ngOnDestroy() {
    this._subLinks.unsubscribe();
    this._subDark.unsubscribe();
  }

  toggleActivityLink(link: string) {
    this.settingsService.toggleActivityLink = link;
  }

  toggleGuardianLink(link: string) {
    this.settingsService.toggleGuardianLink = link;
  }

  toggleXboxLink(link: string) {
    this.settingsService.toggleXboxLink = link;
  }

  toggleDark() {
    this.settingsService.toggleDark();
  }

  setLanguage(language: string) {
    this.settingsService.setLanguage = language;
  }

  back() {
    this.location.back();
  }

  processLinkedAccountsResponse(res) {
    this.linkedAccounts = [];
    res.forEach(linkedAccount => {
      switch (linkedAccount.accountType) {
        case 'mixer':
          if (
            !this.linkedAccounts.filter(
              account =>
                account.mixerAccount &&
                account.mixerAccount.id === linkedAccount.mixerAccount.id,
            ).length
          ) {
            linkedAccount.name = linkedAccount.mixerAccount.username;
            this.linkedAccounts.push(linkedAccount);
          }
          break;
        case 'twitch':
          if (
            !this.linkedAccounts.filter(
              account =>
                account.twitchAccount &&
                account.twitchAccount.id === linkedAccount.twitchAccount.id,
            ).length
          ) {
            this.twitchLinkExists = true;
            linkedAccount.name = linkedAccount.twitchAccount.displayName;
            this.linkedAccounts.push(linkedAccount);
          }
          break;
      }
    });
    this.loadingLinkedAccounts = false;
  }

  loadLinkedAccounts() {
    this.loadingLinkedAccounts = true;
    if (this.jwt) {
      this.gtApiService
        .getAllLinkedAccounts()
        .subscribe(res => this.processLinkedAccountsResponse(res));
    } else {
      this.loadingLinkedAccounts = false;
    }
  }

  removeLink(linkId: string) {
    this.twitchLinkExists = false;

    this.loadingLinkedAccounts = true;
    this.gtApiService
      .removeLink(linkId)
      .subscribe(res => this.processLinkedAccountsResponse(res));
  }

  addTwitchAccount() {
    const url = `${environment.api.baseUrl}/auth/twitch`;
    window.location.href = url;
  }
}
