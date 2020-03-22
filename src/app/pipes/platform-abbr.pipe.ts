import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'platformAbbr',
})
export class PlatformAbbrPipe implements PipeTransform {
  transform(platform: number): string {
    switch (platform) {
      case 1:
        return 'XBOX';
      case 2:
        return 'PSN';
      case 3:
        return 'STEAM';
      case 4:
        return 'BNET';
      case 5:
        return 'STADIA';
      default:
        return platform + '';
    }
  }
}
