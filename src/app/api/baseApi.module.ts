import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {transportServiceProvider} from '../services/transport/transport.service.provider';
import {TransportService} from '../services/transport/transport.service';
import {ApiResult} from '../models/apiResponse';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [transportServiceProvider]
})
export class BaseApiModule {

  constructor(private transport: TransportService) {

  }

  public async sendRequest<T = any>(method: string, body: any = {}, headers: { [p: string]: string | string[] } = {}): Promise<ApiResult<T>> {
    try {
      let response: ApiResult<T> = await this.transport.sendRequest<T>(method, body, headers);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

}
