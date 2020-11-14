import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as moment from 'moment-timezone';
import { CacheService } from '../stogare/cache.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: []
})

export class TimeZoneService {

  constructor(private _cacheService: CacheService) {
  }

  public timeZoneNameList: string[] = [];
  public timeZoneList: any[] = [];
  public guessedTimeZone: string = '';

  public getLabel(tz: string, now: number): string {

    let offset = moment.tz.zone(tz).utcOffset(now);
    let plus: boolean = true;

    if (offset <= 0) {
      plus = false;
      offset = offset * (-1);
    }

    let leftSide = (offset / 60).toFixed(0);
    if (+leftSide < 10) {
      leftSide = '0' + leftSide;
    }
    let rightSide = (offset % 60).toFixed(0);
    if (+rightSide < 10) {
      rightSide = '0' + rightSide;
    }

    return '(UTC' + (plus ? '-' : '+') + leftSide + ':' + rightSide + ') ' + tz.replace(/_/g, ' ');
  }

  public getTimeZonesList(): any {

    if (this._cacheService.checkInSessionStorage('timeZone')) {
      return this._cacheService.getFromSessionStorage('timeZone');
    }

    this.timeZoneNameList = moment.tz.names();
    this.guessedTimeZone = moment.tz.guess();

    let now = new Date().getTime();

    this.timeZoneNameList.forEach(el => {
      this.timeZoneList.push({tz: el, label: this.getLabel(el, now)});
    });

    this.timeZoneList = this.timeZoneList.sort((a, b) => {
      return - (moment.tz.zone(a.tz).utcOffset(now) - moment.tz.zone(b.tz).utcOffset(now));
    });

    this.timeZoneList.unshift({tz: this.guessedTimeZone, label: this.getLabel(this.guessedTimeZone, now)});

    this._cacheService.addToSessionStorage('timeZone', this.timeZoneList, null);

    return this.timeZoneList;
  }
}
