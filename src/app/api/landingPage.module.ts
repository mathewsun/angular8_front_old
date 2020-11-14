import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { transportServiceProvider } from '../services/transport/transport.service.provider';
import { TransportService } from '../services/transport/transport.service';
import { LandingPage } from '../models/landingPage';
import { RolesCollection } from '../models/role';
import { BaseApiModule } from './baseApi.module';
import { ApiResult } from '../models/apiResponse';
import { LandingPageFilter } from '../models/filters/landingPage.filter';
import { Page } from '../models/page';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [transportServiceProvider]
})
export class LandingPageModule extends BaseApiModule {

  public static Roles: RolesCollection;

  constructor(transport: TransportService) {
    super(transport);
  }


  public async createLandingPage(data: { landingPage: LandingPage }): Promise<any> {
    try {
      return await this.sendRequest('landingPage/create', data, {'ContentType': 'application/json'});
    } catch (e) {
      return e;
    }
  }

  public async updateLandingPage(data: LandingPage): Promise<any> {
    try {
      return await this.sendRequest('landingPage/update', data, {'ContentType': 'application/json'});
    } catch (e) {
      return e;
    }
  }

  public async listUnusedLandingPages(): Promise<LandingPage[]> {
    try {
      let result = await this.sendRequest<LandingPage[]>('landingPage/listUnused');
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async getLandingPages(filter: LandingPageFilter = {}): Promise<Page> {
    try {
      let result = await this.sendRequest<Page>('landingPage/list', {filter});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async getLandingPage(id): Promise<LandingPage> {
    try {
      let result: ApiResult<LandingPage> = await this.sendRequest<LandingPage>('landingPage/get', {id});
      return result.body;
    } catch (e) {
      return e;
    }
  }
}
