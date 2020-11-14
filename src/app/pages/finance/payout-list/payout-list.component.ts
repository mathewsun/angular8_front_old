import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PaymentStatusEnum, PaymentType } from '../../../models/enums/paymentStatus.enum';
import { UserPayment } from '../../../models/userPayment';
import { FinanceModule } from '../../../api/finance.module';
import { User } from '../../../models/user';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { DictionaryModule } from '../../../api/dictionary.module';
import { Currency } from '../../../models/currency';
import { TransactionFilter } from '../../../models/filters/transaction.filter';
import { WrapModelArrayPipe } from '../../../models/pipes/wrapModel.pipe';
import { PayoutListService } from '../../../services/transport/payout-list.service';
import { PayoutListTypeEnum } from '../../../models/enums/payoutListType.enum';
import { TransactionConfirmationModalComponent } from '../../../controls/modal/transaction-confirmation-modal/transaction-confirmation-modal.component';
import { PopupInjectorService } from '../../../services/gui/popup-injector.service';

@Component({
  selector: 'app-payout-list',
  templateUrl: './payout-list.component.html',
  styleUrls: ['./payout-list.component.css'],
  providers: [PayoutListService]
})

export class PayoutListComponent implements OnInit {

  public paymentFiltersForm: FormGroup;
  public paymentStatusEnum = PaymentStatusEnum;
  public paymentTypeEnum = PaymentType;
  public paymentsArray: UserPayment[] = [];
  public filterChanged: boolean = true;

  @Input('admin') public admin: boolean = false;
  @Input('users') public users: User[] = [];

  private popupComponent: TransactionConfirmationModalComponent;
  private popupComponentRef: ComponentRef<TransactionConfirmationModalComponent>;

  public queryParamMapSubscription;
  public filtersFormSubscription;

  public pageCount: number = 9;
  public pageSelected: number = 1;
  public itemsPerPage: number = 20;
  public filter: TransactionFilter = {};

  public loading: boolean = false;

  public wrapModelArray: WrapModelArrayPipe = new WrapModelArrayPipe();

  public snapshot: ActivatedRouteSnapshot;
  public currencies: { [key: number]: Currency } = {};

  public type = PayoutListTypeEnum.Personal;

  constructor(
    private _financeModule: FinanceModule,
    private _activatedRoute: ActivatedRoute,
    private _dictionaryModule: DictionaryModule,
    private _payoutListService: PayoutListService,
    private _router: Router,
    private _popupInjectorService: PopupInjectorService) {

    this.snapshot = _activatedRoute.snapshot;

    let daysMinus10 = new Date();
    daysMinus10.setDate(daysMinus10.getDate() - 10);

    this.paymentFiltersForm = new FormGroup({
      'dateFromDP': new FormControl(daysMinus10),
      'dateToDP': new FormControl(new Date()),
      'paymentStatusSelect': new FormControl(null),
      'paymentTypeSelect': new FormControl(null),
      'webmasterListMS': new FormControl(null)
    });

    this.admin = _activatedRoute.snapshot.data.admin;
    let currencies = _dictionaryModule.currencies;

    currencies.forEach(c => {
      this.currencies[c.id] = c;
    });

    this.popupComponentRef = this._popupInjectorService.addComponent(TransactionConfirmationModalComponent);
    this.popupComponent = this.popupComponentRef.instance;

  }

  get dateFromDP() {
    return this.paymentFiltersForm.get('dateFromDP') as FormControl;
  }

  get dateToDP() {
    return this.paymentFiltersForm.get('dateToDP') as FormControl;
  }

  get paymentStatusSelect() {
    return this.paymentFiltersForm.get('paymentStatusSelect') as FormControl;
  }

  get paymentTypeSelect() {
    return this.paymentFiltersForm.get('paymentTypeSelect') as FormControl;
  }

  get webmasterListMS() {
    return this.paymentFiltersForm.get('webmasterListMS') as FormControl;
  }

  public onFilterChange() {
    this.filterChanged = true;
  }

  changeStatus(id: number, status: PaymentStatusEnum, date: Date) {
    this.paymentsArray.forEach(paymentItem => {
      if (paymentItem.id == id) {
        paymentItem.confirmed = date;
        paymentItem.status = status;
      }
    });
  }

  public pay(id: number) {
    this._financeModule.approveRequest(id, 'manual').then(async () => {
      this.changeStatus(id, PaymentStatusEnum.Executed, new Date());
    }).catch(() => {
    });
  }

  public deny(id: number) {
    this._financeModule.rejectRequest(id, 'manual').then(async () => {
      this.changeStatus(id, PaymentStatusEnum.Rejected, new Date());
    }).catch(() => {
    });
  }

  public updateFiltersInQueryParams() {

    // if (!this.filterChanged) {
    //   return;
    // }

    let filter: TransactionFilter = {dateFrom: null, dateTo: null, type: null, status: null, users: []};

    filter.dateFrom = this.dateFromDP.value ? this.dateFromDP.value : null;
    filter.dateTo = this.dateToDP.value ? this.dateToDP.value : null;

    if (this.paymentStatusSelect.value !== '9000') {
      filter.status = this.paymentStatusSelect.value;
    }

    if (this.admin) {
      if (this.paymentTypeSelect.value !== '9000') {
        filter.type = this.paymentTypeSelect.value;
      }
    }

    if (this.admin) {
      if (this.webmasterListMS.value) {
        this.webmasterListMS.value.forEach(wC => filter.users.push(wC.value.id));
      }
    }

    this.addQueryParams(filter.dateFrom, filter.dateTo, filter.status, filter.type, filter.users, 1);

    this.filter = filter;

    this.filterChanged = false;

  }

  ngOnInit() {

    this.type = this.admin ? PayoutListTypeEnum.Admin : PayoutListTypeEnum.Personal;

    // filling filter from query params
    this.updateFiltersFromQueryParams(this.snapshot.queryParamMap);

    // transforming user id list to user list
    let userListDefaultValue: User[] = null;
    if (this.admin) {
      if (this.filter.users) {
        userListDefaultValue = this.idsToStuffListConverter(this.filter.users, this.users);
      }
    }

    // patching values in filters form
    this.dateFromDP.patchValue(this.filter.dateFrom);
    this.dateToDP.patchValue(this.filter.dateTo);

    this.paymentStatusSelect.patchValue(this.filter.status ? this.filter.status : null);

    if (this.admin) {
      this.paymentTypeSelect.patchValue(this.filter.type ? this.filter.type : null);
      this.webmasterListMS.patchValue(userListDefaultValue ? this.wrapModelArray.transform(userListDefaultValue) : null);
    }

    // subscriptions to params change
    this.queryParamMapSubscription = this._activatedRoute.queryParamMap.subscribe((answer) => {

      // updating page number from param query
      this.updatePageSelected(answer);

      this.loading = true;
      this.paymentsArray = [];

      this._payoutListService.getPayoutList(this.type, this.filter, this.pageSelected, this.itemsPerPage).then(async res => {
        this.paymentsArray = res.items;

        if (res.items.length == 0 && this.pageSelected !== 1) {
          this.addQueryParams(this.filter.dateFrom, this.filter.dateTo, this.filter.status, this.filter.type, this.filter.users, 1);
        } else {
          let pageCount = Math.ceil(res.itemsCount / this.itemsPerPage);

          if (pageCount == 0) {
            this.pageCount = 1;
          } else {
            this.pageCount = pageCount;
          }

          this.loading = false;
        }
      })
        .catch(() => {
          this.loading = false;
        });
    });

    // subscription to filters change
    this.filtersFormSubscription = this.paymentFiltersForm.valueChanges.subscribe(() => {
      this.toggleFilters();
    });
  }

  updateFiltersFromQueryParams(e) {
    let filter: any = {};

    if (e.get('dateFrom')) {
      filter.dateFrom = new Date(+e.get('dateFrom'));
    } else {
      let daysMinus10 = new Date();
      daysMinus10.setDate(daysMinus10.getDate() - 10);
      filter.dateFrom = daysMinus10;
    }

    if (e.get('dateTo')) {
      filter.dateTo = new Date(+e.get('dateTo'));
    } else {
      filter.dateTo = new Date();
    }

    if (this.admin) {
      if (e.get('type')) {
        if (e.get('type') !== '9000') {
          filter.type = e.get('type');
        }
      }
    }

    if (e.get('status')) {
      if (e.get('status') !== '9000') {
        filter.type = e.get('status');
      }
    }

    if (e.get('users') == 'all' || e.get('users') == null) {
      filter.users = null;
    } else {
      filter.users = e.get('users').split(',').map(el => parseInt(el));
    }

    //updating this.filter
    this.filter = filter;
  }

  updatePageSelected(e) {
    this.pageSelected = parseInt(e.get('page')) || 1;
  }

  public clearFilters() {
    this.resetFormGroup(this.paymentFiltersForm);

    this.paymentStatusSelect.setValue('9000');
    let daysMinus10 = new Date();

    daysMinus10.setDate(daysMinus10.getDate() - 10);
    this.dateFromDP.setValue(daysMinus10);

    this.dateToDP.setValue(new Date());
    this.toggleFilters();
    this.filter = {};
  }

  public resetFormGroup(formGroup: FormGroup) {
    this.toggleFilters();
    (<any> Object).values(formGroup.controls).forEach(control => {
      control.reset();
      if (control.controls) {
        this.resetFormGroup(control);
      }
    });
  }

  public addQueryParams(dateFrom: Date = null, dateTo: Date = null, status: PaymentStatusEnum = null, type: PaymentType = null, userIdList: number[] = null, page: number = 1) {
    let queryParams: any = {};

    if (dateFrom) {
      queryParams.dateFrom = dateFrom.valueOf();
    }

    if (dateTo) {
      queryParams.dateTo = dateTo.valueOf();
    }

    if (status) {
      queryParams.status = status;
    }

    if (type) {
      queryParams.type = type;
    }

    if (this.admin) {
      if (userIdList) {
        if (userIdList.length > 0 && userIdList.length < this.users.length) {
          queryParams.users = userIdList.join(',');
        }
      }
    }

    queryParams.page = page;
    this._router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: '',
    });
  }

  public toggleFilters() {
    this.filterChanged = true;
  }

  idsToStuffListConverter(ids: number[] = [], stuffWithIds: any[] = []) {
    let result: any[] = [];

    ids.map(id => {
      result.push(stuffWithIds[id - 1]);
    });

    return result;
  }

  onTransactionConfirm(transaction: UserPayment) {
    this.popupComponent.show(transaction);
  }


}
