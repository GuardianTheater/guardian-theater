import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BungieMembershipType } from 'bungie-api-ts/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { DestinyActivityModeType } from 'bungie-api-ts/destiny2';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class GtApiService {
  public excludeLinks: BehaviorSubject<string[]>;

  constructor(private http: HttpClient) {
    this.excludeLinks = new BehaviorSubject([]);
    this.getVotes().subscribe();
  }

  getEncounteredClips(
    membershipType: BungieMembershipType,
    membershipId: string,
  ): Observable<EncounteredClips> {
    // const url = `https://api.guardian.theater/encounteredClips/${membershipType}/${membershipId}`;
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

  removeLink(linkId: string) {
    const url = `${environment.api.baseUrl}/removeLink`;
    return this.http.post(url, { linkId }) as Observable<any>;
  }

  addLink(jwt: string) {
    const url = `${environment.api.baseUrl}/addLink`;
    return this.http.post(url, { jwt }) as Observable<any>;
  }

  getVotes() {
    const url = `${environment.api.baseUrl}/getVotes`;
    return this.http.get(url).pipe(
      map(res => {
        this.excludeLinks.next((res as any).map(vote => vote.link.id));
      }),
    ) as Observable<any>;
  }

  reportLink(linkId: string) {
    const url = `${environment.api.baseUrl}/reportLink`;
    return this.http.post(url, { linkId }).pipe(
      map(res => {
        this.excludeLinks.next((res as any).map(vote => vote.link.id));
      }),
    ) as Observable<any>;
  }

  unreportLink(linkId: string) {
    const url = `${environment.api.baseUrl}/unreportLink`;
    return this.http.post(url, { linkId }).pipe(
      map(res => {
        this.excludeLinks.next((res as any).map(vote => vote.link.id));
      }),
    ) as Observable<any>;
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
  id: string;
  linkType: 'bungiePartner' | 'nameMatch' | 'authentication' | 'ocr';
  accountType: 'twitch' | 'mixer' | 'xbox';
  twitchAccount?: {
    id: string;
    login: string;
    displayName: string;
    lastRecordingCheck: string;
  };
  mixerAccount?: {
    id: number;
    username: string;
  };
  xboxAccount?: {
    gamertag: string;
    lastClipCheck: string;
  };
  destinyProfile: {
    membershipId: string;
    membershipType: number;
    displayName: string;
    pageLastVisited: string;
    bnetProfileChecked: string;
    activitiesLastChecked: string;
    xboxNameMatchChecked: string;
    twitchNameMatchChecked: string;
    mixerNameMatchChecked: string;
  };

  name?: string;
}
