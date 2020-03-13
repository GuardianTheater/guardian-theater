import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BungieMembershipType } from 'bungie-api-ts/user';
import { Observable } from 'rxjs';
import { DestinyActivityModeType } from 'bungie-api-ts/destiny2';
import { environment } from 'environments/environment';

@Injectable()
export class GtApiService {
  constructor(private http: HttpClient) {}

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
  team: number;
  linkName: string;
  linkId?: string | number;
  type: string;
  url: string;
  embedUrl: string;
  thumbnail: string;
  title: string;
  offset?: string;
  play?: boolean;
}
