import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { transportServiceProvider } from '../services/transport/transport.service.provider';
import { TransportService } from '../services/transport/transport.service';
import { ApiResult } from '../models/apiResponse';
import { Offer } from '../models/offer';
import { Page } from '../models/page';
import { BaseApiModule } from './baseApi.module';
import { CustomPayout } from '../models/customPayout';
import { OfferFilter } from '../models/filters/offer.filter';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [transportServiceProvider]
})
export class OfferModule extends BaseApiModule {

  constructor(transport: TransportService) {
    super(transport);
  }

  public async listAll(filter: OfferFilter = null): Promise<Page> {
    try {
      let result: ApiResult<Page> = await this.sendRequest<Page>('offer/list', {filter});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async listMy(filter: OfferFilter = null): Promise<Page> {
    try {
      let result: ApiResult<Page> = await this.sendRequest<Page>('offer/listMy', {filter});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async listPrivate(filter: OfferFilter = null): Promise<Page> {
    try {
      let result: ApiResult<Page> = await this.sendRequest<Page>('offer/listPrivate', {filter});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async listAllowed(filter: OfferFilter = null): Promise<Page> {
    try {
      let result: ApiResult<Page> = await this.sendRequest<Page>('offer/listAllowed', {filter});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async offerCreate(objToSend: any = {}) {
    try {
      return await this.sendRequest('offer/create', objToSend, {'ContentType': 'application/json'});
    } catch (e) {
      return e;
    }
  }

  public async offerUpdate(objToSend: any = {}) {
    try {
      return await this.sendRequest('offer/update', objToSend, {'ContentType': 'application/json'});
    } catch (e) {
      return e;
    }
  }

  /**
   *
   * @param id
   */
  public async getOffer(id: number): Promise<Offer> {
    try {
      let result: ApiResult<Offer> = await this.sendRequest<Offer>('offer/get', {id});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async getCustomPayout(offset: number = 0, limit: number = 500, offerId: number = null, userId: number = null) {
    try {
      let result = await this.sendRequest('offer/getCustomPayout', {offset, limit, offerId, userId});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async deleteCustomPayout(actionIdArray: number[]) {
    try {
      let result = await this.sendRequest('offer/DeleteCustomPayout', actionIdArray);
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async setCustomPayout(payoutsToSend: CustomPayout[]) {
    try {
      let result = await this.sendRequest<CustomPayout[]>('offer/SetCustomPayout', payoutsToSend);
      return result.body;
    } catch (e) {
      return e;
    }
  }
}
