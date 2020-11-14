import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamModule } from '../../api/stream.module';
import { StreamFilter } from '../../models/filters/stream.filter';
import { StreamListTypeEnum } from '../../models/enums/streamListType.enum';
import { Page } from '../../models/page';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: []
})

export class StreamListService implements OnInit {

  constructor(private _streamModule: StreamModule) {
  }

  ngOnInit() {

  }

  public async getStreamList(type: StreamListTypeEnum = StreamListTypeEnum.Personal, filter: StreamFilter = null, pageNumber: number = 1, itemsPerPage: number = 10): Promise<Page> {
    let payload = filter;

    payload.itemsPerPage = itemsPerPage;
    payload.pageNumber = pageNumber - 1;

    let streamList: Page;

    switch (type) {
      case StreamListTypeEnum.Personal:
        streamList = await this._streamModule.listStreams(payload);
        return streamList;
      case StreamListTypeEnum.Admin:
        streamList = await this._streamModule.adminListStreams(payload);
        return streamList;
    }
  }
}
