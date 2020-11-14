import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { OfferModule } from '../api/offer.module';
import * as moment from 'moment';
import { Moment } from 'moment';
import { StatisticsModule } from '../api/statistics.module';
import { StatRecord } from '../models/statRecord';

@Injectable({
  providedIn: 'root'
})
export class StatisticsResolverService implements Resolve<StatRecord[]> {
  constructor(
    private offerModule: OfferModule,
    private _router: Router,
    private _statisticsModule: StatisticsModule) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<StatRecord[]> {
    let from: Moment = moment();
    from = from.subtract(6, 'd').endOf('day');

    let dateFrom = from.startOf('day').toDate();
    let dateTo = moment().endOf('day').toDate();

    let loanByDate;
    try {
      loanByDate = await this._statisticsModule.loanByDate(dateFrom, dateTo, null, '1', {timezone: (moment.tz.guess())});
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    if (!loanByDate) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    return loanByDate;
  }
}
