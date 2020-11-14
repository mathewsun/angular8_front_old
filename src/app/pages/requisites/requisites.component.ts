import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserPaymentInfo } from '../../models/userPaymentInfo';
import { UserModule } from '../../api/user.module';
import { User } from '../../models/user';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AlertService } from '../../services/gui/alert.service';
import { AlertTypeEnum } from '../../models/enums/alertType.enum';

@Component({
  selector: 'app-requisites',
  templateUrl: './requisites.component.html',
  styleUrls: ['./requisites.component.css']
})
export class RequisitesComponent implements OnInit {

  public processing: boolean = false;

  public snapshot: ActivatedRouteSnapshot;

  constructor(
    private _titleService: Title,
    private _userModule: UserModule,
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService) {
    this.snapshot = _activatedRoute.snapshot;

    this._titleService.setTitle(this.snapshot.data.title);

    this.requisitesForm = new FormGroup({
      'userId': new FormControl(null),
      'wmr': new FormControl(null, [Validators.pattern(/[R][0-9]{12}/), Validators.maxLength(13)]),
      'wmz': new FormControl(null, [Validators.pattern(/[Z][0-9]{12}/), Validators.maxLength(13)]),
      'bankCard': new FormControl(null, Validators.pattern(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)),
      'qiwiWallet': new FormControl(null, Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)),
      'yandexMoney': new FormControl(null, Validators.pattern(/[0-9]*/g)),
      'bankAccount': new FormControl({value: '', disabled: true}),
    });
  }

  public requisitesForm: FormGroup;

  public reqData: UserPaymentInfo;

  ngOnInit() {

    this.handleUser(this._userModule.currentUser);

    this._userModule.userChanged.subscribe(user => {
      this.handleUser(user);
    });
  }

  private handleUser(user: User) {
    if (!user) {
      return;
    }
    if (!user.paymentInfo) {
      return;
    }

    this.requisitesForm.patchValue(user.paymentInfo);
  }

  public save() {

    this.requisitesForm.markAllAsTouched();
    if (this.requisitesForm.invalid) return;

    let info = this.requisitesForm.getRawValue();

    this.processing = true;
    this._userModule.updatePaymentInfo(info).then(async () => {
      this._alertService.addAlert('Реквизиты сохранены', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
      this.processing = false;
    }).catch(err => {
      this._alertService.addAlert('Ошибка: ' + err.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
      this.processing = false;
    });

  }

}
