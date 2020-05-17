import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BungieMembershipType } from 'bungie-api-ts/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { DestinyActivityModeType } from 'bungie-api-ts/destiny2';
import { environment } from 'environments/environment';
import { take } from 'rxjs/operators';

@Injectable()
export class GtApiService {
  public excludeLinks: BehaviorSubject<string[]>;

  constructor(private http: HttpClient) {
    this.excludeLinks = new BehaviorSubject([]);
    try {
      const excludeLinks = JSON.parse(localStorage.getItem('excluded_links'));
      if (excludeLinks && excludeLinks.length) {
        this.excludeLinks.next(excludeLinks);
      }
    } catch (e) {}
  }

  getEncounteredClips(
    membershipType: BungieMembershipType,
    membershipId: string,
  ): Observable<EncounteredClips> {
    const url = `${environment.api.baseUrl}/encounteredClips/${membershipType}/${membershipId}`;
    return this.http.get(url) as Observable<EncounteredClips>;
  }

  getInstance(instanceId: string): Observable<Instance> {
    // const url = `https://api.guardian.theater/instance/${instanceId}`;
    const url = `${environment.api.baseUrl}/instance/${instanceId}`;
    return this.http.get(url) as Observable<Instance>;
  }

  getStreamerVsStreamer() {
    // const url = `https://api.guardian.theater/streamervsstreamer`;
    const url = `${environment.api.baseUrl}/streamervsstreamer`;
    return this.http.get(url) as Observable<Instance[]>;
  }

  getAllLinkedAccounts() {
    const url = `${environment.api.baseUrl}/linkedAccounts`;
    return this.http.get(url) as Observable<LinkedAccount[]>;
  }

  removeLink(link: LinkedAccount) {
    const url = `${environment.api.baseUrl}/removeLink`;
    let linkId = '';
    switch (link.type) {
      case 'mixer':
        linkId = `${link.membershipId}.${link.type}.${link.mixer.userId}`;
        break;
      case 'twitch':
        linkId = `${link.membershipId}.${link.type}.${link.twitch.userId}`;
        break;
      case 'xbox':
        linkId = `${link.membershipId}.${link.type}.${link.xbox.gamertag}`;
        break;
    }
    return this.http.post(url, { linkId }) as Observable<any>;
  }

  addLink(jwt: string) {
    const url = `${environment.api.baseUrl}/addLink`;
    return this.http.post(url, { jwt }) as Observable<any>;
  }

  reportLink(linkId: string) {
    const url = `${environment.api.baseUrl}/reportLink`;
    this.excludeLinks.pipe(take(1)).subscribe((excludeLinks) => {
      excludeLinks.push(linkId);
      try {
        localStorage.setItem('excluded_links', JSON.stringify(excludeLinks));
      } catch (e) {}
      this.excludeLinks.next(excludeLinks);
    });
    return this.http.post(url, { linkId });
  }

  unreportLink(linkId: string) {
    const url = `${environment.api.baseUrl}/unreportLink`;
    this.excludeLinks.pipe(take(1)).subscribe((excludeLinks) => {
      excludeLinks = excludeLinks.filter((link) => link !== linkId);
      try {
        localStorage.setItem('excluded_links', JSON.stringify(excludeLinks));
      } catch (e) {}
      this.excludeLinks.next(excludeLinks);
    });
    return this.http.post(url, { linkId });
  }
}

export interface EncounteredClips {
  profile: {
    membershipId: string;
    membershipType: number;
    displayName: string;
    pageLastVisited: string;
    bnetProfileChecked: string;
    activitiesLastChecked: string;
    xboxNameMatchChecked: string;
    twitchNameMatchChecked: string;
    mixerNameMatchChecked: string;
    bnetProfile?;
  };
  instances: Instance[];
}

export interface Instance {
  instanceId: string;
  activityHash: number;
  directorActivityHash: number;
  mode: DestinyActivityModeType;
  membershipType: number;
  period: string;
  team: number;
  videos: Video[];
}

export interface Video {
  displayName: string;
  membershipId: string;
  membershipType: number;
  bnetMembershipId?: string;
  team: number;
  linkName: string;
  linkId?: string;
  type: string;
  url: string;
  embedUrl: string;
  thumbnail: string;
  title: string;
  offset?: string;

  play?: boolean;
  infoExpanded?: boolean;
  badLink?: boolean;
  reporting?: boolean;
}

export interface LinkedAccount {
  membershipId?: string;
  membershipType?: BungieMembershipType;
  displayName?: string;

  fresh?: boolean;
  type: 'twitch' | 'mixer' | 'xbox';

  rejected?: boolean;
  reported?: boolean;
  reportedBy?: string[];

  lastClipCheck?: Date;
  clipCheckStatus: 'idle' | 'active';

  lastLinkedProfilesCheck?: Date;
  linkedProfiles?: {
    membershipId: string;
    membershipType: BungieMembershipType;
    displayName?: string;
    withError?: boolean;

    lastCharacterIdCheck?: Date;
    characterIds?: string[];
  }[];

  twitch?: {
    userId: string;
    login: string;
    displayName: string;
  };

  mixer?: {
    userId: number;
    username: string;
    channelId: number;
    token: string;
  };

  xbox?: {
    gamertag: string;
    xuid?: string;
  };
}
