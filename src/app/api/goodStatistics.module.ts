import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {transportServiceProvider} from '../services/transport/transport.service.provider';
import {TransportService} from '../services/transport/transport.service';
import {BaseApiModule} from "./baseApi.module";
import {StatRecord} from "../models/statRecord";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [transportServiceProvider]
})
export class GoodStatisticsModule extends BaseApiModule {

  constructor(transport: TransportService) {
    super(transport);
  }

  public async loanByStream(from: Date, to: Date = null, userId: number = null, filter: any = null): Promise<StatRecord[]> {
    let response = await this.sendRequest<StatRecord[]>('goodStat/loanByStream', {from, to, userId, filter});

    return response.body;
  }

  public async loanByOffer(from: Date, to: Date = null, userId: number = null, filter: any = null): Promise<StatRecord[]> {
    let response = await this.sendRequest<StatRecord[]>('goodStat/loanByOffer', {from, to, userId, filter});
    return response.body;
  }

  public async loanByDate(from: Date, to: Date = null, userId: number = null, groupBy = 'day', filter: any = null): Promise<StatRecord[]> {
    let response = await this.sendRequest<StatRecord[]>('goodStat/loanByDate', {from, to, userId, groupBy, filter});
    return response.body;
  }

  public async loanByUser(from: Date, to: Date = null, filter: any = null): Promise<StatRecord[]> {
    let response = await this.sendRequest<StatRecord[]>('goodStat/loanByUser', {from, to, filter});
    return response.body;
  }
}
