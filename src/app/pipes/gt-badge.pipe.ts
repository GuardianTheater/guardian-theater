import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gtBadge'
})
export class GtBadgePipe implements PipeTransform {

  transform(membershipId: string): string {
    let owner = [
      '375129' // chrisfried
    ];
    let contributors = [
      '5116514', // RealAngryMonkey
      '9321659' // My Derpy Turtle
    ];
    let shirt = [
      '168740' // Menos del Oso
    ];
    let patrons = [
      '9303125', // v DontCare v
      '10213132', // designker
      '11828236', // cowgod77
      '13513244', // CHUBS152001
      '5197148' // lowlines
    ];
    let donors = [
      '8278779', // QuiscalusMajor
      '3885548', // Phyrne
      '4165071', // Benimus
      '11009584', // Mystareez
      '6773619', // Fordluvr
      '168740', // Menos del Oso
      '10949513', // JohnnyG_11
      '5116514', // RealAngryMonkey
      '10762460', // xImDeRey
      '14050724', // LoveDazed
      '5996932', // VlakatafakatA
      '4170740', // LeBrometheus
      '167493', // Marruk
      '3836546', // CobraliciouZ
      '14864748' // luckyDUELstars
    ];
    if (owner.indexOf(membershipId) > -1) {
      return 'Owner';
    } else if (contributors.indexOf(membershipId) > -1) {
      return 'Contributor';
    } else if (shirt.indexOf(membershipId) > -1) {
      return 'Shirt Haver';
    } else if (patrons.indexOf(membershipId) > -1) {
      return 'Patron';
    } else if (donors.indexOf(membershipId) > -1) {
      return 'Donor';
    } else {
      return '';
    }
  }

}
