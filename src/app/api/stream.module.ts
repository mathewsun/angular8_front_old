import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { transportServiceProvider } from '../services/transport/transport.service.provider';
import { TransportService } from '../services/transport/transport.service';
import { Stream } from '../models/stream';
import { RolesCollection } from '../models/role';
import { BaseApiModule } from './baseApi.module';
import { StreamFilter } from '../models/filters/stream.filter';
import { Page } from '../models/page';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [transportServiceProvider]
})

export class StreamModule extends BaseApiModule {

  public static Roles: RolesCollection;

  constructor(transport: TransportService) {
    super(transport);
  }

  public async createStream(stream: Stream, landingPages: {}, postbackLinkIds: Number[]): Promise<Stream> {
    try {
      let result = await this.sendRequest<Stream>('stream/create', {stream, landingPages, postbackLinkIds});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async updateStream(stream: Stream, landingPages: {}, postbackLinkIds: Number[]): Promise<Stream> {
    try {
      let result = await this.sendRequest<Stream>('stream/update', {stream, landingPages, postbackLinkIds});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async deleteStream(id: number): Promise<void> {
    try {
      await this.sendRequest<Stream>('stream/delete', {id});
      return null;
    } catch (e) {
      return e;
    }
  }

  public async getStream(id: number = null): Promise<Stream> {
    try {
      let result = await this.sendRequest<Stream>('stream/get', {id});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async listStreams(filter: StreamFilter = null): Promise<Page> {
    try {
      let result = await this.sendRequest<Page>('stream/list', {filter});
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async adminListStreams(filter: StreamFilter = null): Promise<Page> {
    try {
      let result = await this.sendRequest<Page>('stream/admin/list', {filter});
      return result.body;
    } catch (e) {
      return e;
    }
  }
}
