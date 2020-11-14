import { StatRecord } from '../models/statRecord';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class StatIndicatorCalculatorService {

  constructor(){}

  public calculateIndicators(stats: StatRecord[]){
    stats.forEach(el => {
      el.approveRate = (el.payClicks / (el.payClicks + el.holdClicks + el.rejectClicks)) || 0;
      el.earnPerClickRate = (el.payPayout / el.uniqueClicks) || 0;
      el.totalLeads = (el.payClicks + el.holdClicks + el.rejectClicks) || 0;
      el.conversionRate = (el.holdClicks + el.payClicks + el.rejectClicks)/el.uniqueClicks || 0;
    });

    return stats;
  }
}
