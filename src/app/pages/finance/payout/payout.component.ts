import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Currency } from '../../../models/currency';
import { DictionaryModule } from '../../../api/dictionary.module';
import { FinanceModule } from '../../../api/finance.module';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Balance } from '../../../models/balance';
import { UserModule } from '../../../api/user.module';
import { AlertService } from '../../../services/gui/alert.service';
import { AlertTypeEnum } from '../../../models/enums/alertType.enum';

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.css']
})
export class PayoutComponent implements OnInit {

  public orderPayoutForm: FormGroup;
  public currencies: Currency[] = [];
  public balances: Balance[] = [];
  public requisites: {} = {};
  public processing = false;
  public snapshot: ActivatedRouteSnapshot;
  public noWallets = false;
  public sumValidators: ValidatorFn[];
  public min = null;
  public max = null;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _dictionaryModule: DictionaryModule,
    private _financeModule: FinanceModule,
    private _userModule: UserModule,
    private _route: ActivatedRoute,
    private _alertService: AlertService
  ) {
    this.snapshot = _route.snapshot;

    if (this.snapshot.data.requisites.wmr)          this.requisites['WMR'] = this.snapshot.data.requisites.wmr;
    if (this.snapshot.data.requisites.wmz)          this.requisites['WMZ'] = this.snapshot.data.requisites.wmz;
    if (this.snapshot.data.requisites.bankCard)     this.requisites['Bank card'] = this.snapshot.data.requisites.bankCard;
    if (this.snapshot.data.requisites.qiwiWallet)   this.requisites['Qiwi'] = this.snapshot.data.requisites.qiwiWallet;
    if (this.snapshot.data.requisites.yandexMoney)  this.requisites['Yandex.Money'] = this.snapshot.data.requisites.yandexMoney;
    if (this.snapshot.data.requisites.bankAccount)  this.requisites['Current account'] = this.snapshot.data.requisites.bankAccount;

    if (Object.keys(this.requisites).length == 0) {this.noWallets = true}
  }

  ngOnInit() {


    this._userModule.getApprovedBalances().then(balances => {
        balances.forEach(el => {
          if (el.amount) {
            this.balances.push(el);
            this.currencies.push(el.currency);
          }
        });
      }
    );

    this.orderPayoutForm = this._formBuilder.group({
      'currencySelect': new FormControl(null, Validators.required),
      'walletSelect': new FormControl(null, Validators.required),
      'payoutSum': new FormControl(null, [])
    });

    this.sumValidators = [Validators.required, Validators.pattern(/^(0|[1-9]\d*)?\.?[0-9]{0,2}$/)];
    this.payoutSum.setValidators(this.sumValidators);


  }

  public changeValidators(currencyId: number, balance: Balance[]) {
    let validators: ValidatorFn[] = [Validators.required, Validators.pattern(/^(0|[1-9]\d*)?\.?[0-9]{0,2}$/)];
    this.min = null;

    switch (+currencyId) {
      case 1: this.min = 50; break; // USD
      case 2: this.min = 50; break; // EUR
      case 10: this.min = 2000; break; // RUR
      case 11: this.min = 1000; break; // UAH
      case 12: this.min = 10000; break; // KZT
    }

    this.max = null;

    for (let i = 0; i < balance.length; i++) {
      if (balance[i].currency.id == currencyId) {
        this.max = balance[i].amount;
        break;
      }
    }

    validators.push(Validators.min(this.min));
    validators.push(Validators.max(this.max));

    this.payoutSum.setValidators(validators);
  }

  get currencySelect() {
    return this.orderPayoutForm.get('currencySelect');
  };

  get payoutSum() {
    return this.orderPayoutForm.get('payoutSum');
  };

  get walletSelect() {
    return this.orderPayoutForm.get('walletSelect');
  };

  refresh() {
    this.orderPayoutForm.reset();
    this.orderPayoutForm.markAsUntouched();
    this.processing = false;
  }

  sendRequest() {
    this.processing = true;

    if (this.orderPayoutForm.invalid) {
      this.orderPayoutForm.markAllAsTouched();
      this.processing = false;
      return;
    }

    let currency;

    for (let i = 0; i < this.currencies.length; i++) {
      if (this.currencies[i].id == this.currencySelect.value) {
        currency = this.currencies[i];
        break;
      }
    }

    let paymentMethod = {
      name: this.walletSelect.value,
      account: this.requisites[this.walletSelect.value],
    };

    let amount = this.payoutSum.value;

    this._financeModule.requestWithdraw(currency, paymentMethod, amount).then(() => {
        this._alertService.addAlert('Запрос размещён', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        location.reload(); // Fix this please
        // this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        //   this._router.navigate(['dashboard/finance']);
        // });
        // this.processing = false;
      }
    ).catch(error => {
      this._alertService.addAlert('Ошибка: ' + error.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
      this.processing = false;
    });

  }

}
