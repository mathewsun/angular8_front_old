import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { transportServiceProvider } from '../services/transport/transport.service.provider';
import { TransportService } from '../services/transport/transport.service';
import { ApiResult } from '../models/apiResponse';
import { BaseApiModule } from './baseApi.module';
import { Traffback } from '../models/traffback';
import { Postback } from '../models/postback';
import { Page } from '../models/page';
import { UserLinkFilter } from '../models/filters/userLink.filter';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [transportServiceProvider]
})
export class UserLinksModule extends BaseApiModule {

  constructor(transport: TransportService) {
    super(transport);
  }

  public async traffbackList(filter: UserLinkFilter = null): Promise<Page> {
    try {
      let result: ApiResult<Page> = await this.sendRequest<Page>('userLinks/traffback/list', {filter});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async adminTraffbackList(filter: UserLinkFilter = null): Promise<Page> {
    try {
      let result: ApiResult<Page> = await this.sendRequest<Page>('userLinks/admin/traffback/list', {filter});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async postbackList(filter: UserLinkFilter = null): Promise<Page> {
    try {
      let result: ApiResult<Page> = await this.sendRequest<Page>('userLinks/postback/list', {filter});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async adminPostbackList(filter: UserLinkFilter = null): Promise<Page> {
    try {
      let result: ApiResult<Page> = await this.sendRequest<Page>('userLinks/admin/postback/list', {filter});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async getPostback(id: number): Promise<Postback> {
    try {
      let result: ApiResult<Postback> = await this.sendRequest<Postback>('userLinks/postback/get', {id});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async getTraffback(id: number): Promise<Traffback> {
    try {
      let result: ApiResult<Traffback> = await this.sendRequest<Traffback>('userLinks/traffback/get', {id});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async deletePostback(id: number): Promise<Postback> {
    try {
      let result: ApiResult<Postback> = await this.sendRequest<Postback>('userLinks/postback/delete', {id});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async deleteTraffback(id: number): Promise<Traffback> {
    try {
      let result: ApiResult<Traffback> = await this.sendRequest<Traffback>('userLinks/traffback/delete', {id});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async adminDeletePostback(id: number): Promise<Postback> {
    try {
      let result: ApiResult<Postback> = await this.sendRequest<Postback>('userLinks/admin/postback/delete', {id});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async adminDeleteTraffback(id: number): Promise<Traffback> {
    try {
      let result: ApiResult<Traffback> = await this.sendRequest<Traffback>('userLinks/admin/traffback/delete', {id});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async createPostback(objToSend: any = {}) {
    try {
      return await this.sendRequest('userLinks/postback/create', objToSend, {'ContentType': 'application/json'});
    } catch (e) {
      return e;
    }
  }

  public async createTraffback(objToSend: any = {}) {
    try {
      return await this.sendRequest('userLinks/traffback/create', objToSend, {'ContentType': 'application/json'});
    } catch (e) {
      return e;
    }
  }

  public async updatePostback(objToSend: any = {}) {
    try {
      return await this.sendRequest('userLinks/postback/update', objToSend, {'ContentType': 'application/json'});
    } catch (e) {
      return e;
    }
  }

  public async updateTraffback(objToSend: any = {}) {
    try {
      return await this.sendRequest('userLinks/traffback/update', objToSend, {'ContentType': 'application/json'});
    } catch (e) {
      return e;
    }
  }

  public async adminUpdatePostback(objToSend: any = {}) {
    try {
      return await this.sendRequest('userLinks/admin/postback/update', objToSend, {'ContentType': 'application/json'});
    } catch (e) {
      return e;
    }
  }

  public async adminUpdateTraffback(objToSend: any = {}) {
    try {
      return await this.sendRequest('userLinks/admin/traffback/update', objToSend, {'ContentType': 'application/json'});
    } catch (e) {
      return e;
    }
  }
}
