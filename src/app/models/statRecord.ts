import { Currency } from './currency';

export interface StatRecord {
  name: string;
  date: Date;

  currency: Currency;
  currencyIsoCode: string;

  conversionRate: number;
  approveRate: number;
  earnPerClickRate: number;

  totalLeads: number;

  totalClicks: number;
  uniqueClicks: number;
  holdClicks: number;
  payClicks: number;
  rejectClicks: number;

  trafficBackClicks: number;

  holdPayout: number;
  payPayout: number;
  rejectPayout: number;
  platformPayout: number;
  smsCosts: number;
  id: number;

}
