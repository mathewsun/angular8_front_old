import { Component, OnInit } from '@angular/core';
import { UserPayment } from '../../../models/userPayment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FinanceModule } from '../../../api/finance.module';
import { AlertService } from '../../../services/gui/alert.service';
import { AlertTypeEnum } from '../../../models/enums/alertType.enum';

@Component({
  selector: 'app-transaction-confirmation-modal',
  templateUrl: './transaction-confirmation-modal.component.html',
  styleUrls: ['./transaction-confirmation-modal.component.css']
})
export class TransactionConfirmationModalComponent implements OnInit {

  public isShow: Boolean = false;
  public transaction: UserPayment = null;
  public reasonFormGroup: FormGroup;

  constructor(
    private _financeModule: FinanceModule,
    private _alertService: AlertService
  ) {
    this.reasonFormGroup = new FormGroup({
      'reasonTA': new FormControl(null, Validators.required),
    });
  }

  public show(transaction: UserPayment) {
    if (!transaction) {
      return;
    }
    this.isShow = true;
    this.transaction = transaction;
  }

  public close() {
    this.isShow = false;
  }

  get reasonTA() {
    return this.reasonFormGroup.get('reasonTA');
  }

  public onOutsideClick() {
    this.close();
  }

  ngOnInit() {

  }

  public confirm(id: number, reason: string = 'Manual') {
    this._financeModule.approveRequest(id, reason).then(() => {
      if (this.reasonFormGroup.invalid) {
        this.reasonFormGroup.markAllAsTouched();
        this._alertService.addAlert('Ошибка: введите причину', AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        return;
      }
        this._alertService.addAlert('Транзакция одобрена', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        this.transaction.status = 2;
        this.transaction.executed = new Date();
        this.close();
      }
    ).catch(err => {
      this._alertService.addAlert('Ошибка: ' + err.message, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
    });
  }

  public reject(id: number, reason: string = 'Manual') {
    if (this.reasonFormGroup.invalid) {
      this.reasonFormGroup.markAllAsTouched();
      this._alertService.addAlert('Ошибка: введите причину', AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
      return;
    }
    this._financeModule.rejectRequest(id, reason).then(() => {
        this._alertService.addAlert('Транзакция отклонена', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        this.transaction.status = 4;
        this.transaction.executed = new Date();
        this.close();
      }
    ).catch(err => {
      this._alertService.addAlert('Ошибка: ' + err.message, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
    });
  }

}
