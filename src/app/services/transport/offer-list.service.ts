import { OfferListTypeEnum } from '../../models/enums/offerListType.enum';
import { OfferFilter } from '../../models/filters/offer.filter';
import { OfferModule } from '../../api/offer.module';
import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../../models/page';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: []
})

export class OfferListService implements OnInit{

  constructor(private _offerModule: OfferModule){
  }

  ngOnInit(){
  }

  public async getOfferList (type: OfferListTypeEnum = OfferListTypeEnum.All, filter: OfferFilter = null, pageNumber: number = 0, itemsPerPage: number = 10): Promise<Page> {
    let payload = filter;
    payload.itemsPerPage = itemsPerPage;
    payload.pageNumber = pageNumber-1;

    switch (type) {
      case OfferListTypeEnum.All:
        return await this._offerModule.listAll(payload);
      case OfferListTypeEnum.My:
        return await this._offerModule.listMy(payload);
      case OfferListTypeEnum.Private:
        return await this._offerModule.listPrivate(payload);
    }
  }

}
