import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../../models/page';
import { FinanceModule } from '../../api/finance.module';
import { PayoutListTypeEnum } from '../../models/enums/payoutListType.enum';
import { TransactionFilter } from '../../models/filters/transaction.filter';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: []
})

export class PayoutListService implements OnInit {

  constructor(private _financeModule: FinanceModule) {
  }

  ngOnInit() {

  }

  public async getPayoutList(type: PayoutListTypeEnum = PayoutListTypeEnum.Personal, filter: TransactionFilter = null, pageNumber: number = 1, itemsPerPage: number = 20): Promise<Page> {
    let payload = filter;

    payload.itemsPerPage = itemsPerPage;
    payload.pageNumber = pageNumber - 1;

    let payoutList: Page;

    switch (type) {
      case PayoutListTypeEnum.Personal:
        payoutList = await this._financeModule.getPayments(payload);
        return payoutList;
      case PayoutListTypeEnum.Admin:
        payoutList = await this._financeModule.adminPayments(payload);
        return payoutList;
    }
  }
}
