import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {transportServiceProvider} from '../services/transport/transport.service.provider';
import {TransportService} from '../services/transport/transport.service';
import {BaseApiModule} from './baseApi.module';
import {ApiResult} from '../models/apiResponse';
import {UserPayment} from '../models/userPayment';
import {Currency} from '../models/currency';
import {Page} from "../models/page";
import { TransactionFilter } from '../models/filters/transaction.filter';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [transportServiceProvider]
})
export class FinanceModule extends BaseApiModule {

  constructor(transport: TransportService) {
    super(transport);
  }

  public async getPayments(filter: TransactionFilter): Promise<Page<UserPayment>> {
    let result: ApiResult<Page<UserPayment>> = await this.sendRequest<Page<UserPayment>>('payment/list', {
      filter
    });
    return result.body;
  }

  public async adminPayments(filter: TransactionFilter): Promise<Page<UserPayment>> {
    let result: ApiResult<Page<UserPayment>> = await this.sendRequest<Page<UserPayment>>('payment/admin/list', {
      filter
    });
    return result.body;
  }

  public async approveRequest(id: number, reason: string): Promise<UserPayment> {
    try {
      let result = await this.sendRequest<UserPayment>('payment/admin/approveRequest', {id, reason});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async rejectRequest(id: number, reason: string): Promise<UserPayment> {
    try {
      let result = await this.sendRequest<UserPayment>('payment/admin/rejectRequest', {id, reason});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async getWithdrawRequest(id: number): Promise<UserPayment> {
    let result: ApiResult<UserPayment> = await this.sendRequest<UserPayment>('payment/getFullRequest', {id});
    return result.body;
  }

  public async requestWithdraw(currency: Currency, paymentMethod: { name: string, account: string }, amount: number): Promise<UserPayment> {
    try {
      let result = await this.sendRequest<UserPayment>('payment/RequestWithdraw', {
        currency,
        paymentMethod,
        amount
      }, {'ContentType': 'application/json'});

      return result.body;
    } catch (e) {
      return e;
    }
  }
}
