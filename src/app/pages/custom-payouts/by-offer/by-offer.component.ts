import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Offer } from '../../../models/offer';
import { CustomPayout } from '../../../models/customPayout';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { EnumToArrayPipe } from '../../../models/pipes/enumToArray.pipe';
import { ActionPayoutTypeEnum } from '../../../models/enums/actionPayoutType.enum';
import { MultiSelectComponent } from '../../../controls/multi-select/multi-select.component';
import { WrapModelArrayPipe } from '../../../models/pipes/wrapModel.pipe';
import { OfferModule } from '../../../api/offer.module';
import { UserModule } from '../../../api/user.module';
import { User } from '../../../models/user';
import { AlertService } from '../../../services/gui/alert.service';
import { AlertTypeEnum } from '../../../models/enums/alertType.enum';

@Component({
  selector: 'app-by-offer',
  templateUrl: './by-offer.component.html',
  styleUrls: ['./by-offer.component.css']
})

export class ByOfferComponent implements OnInit {

  @ViewChild('offersSelect', {
    static: true,
    read: MultiSelectComponent
  }) offersSelect: MultiSelectComponent;

  public allUsers: User[] = [];
  public customPayoutActions: CustomPayout[] = [];
  public customActionsByUser = {};
  public outputedUsers = {};

  public snapshot: ActivatedRouteSnapshot;

  public customPayoutFormGroup: FormGroup;
  public wrapModelArrayPipe = new WrapModelArrayPipe;

  public actionType: Array<string>;

  public processing: boolean = false;

  public offer: Offer = null;
  public offerId: number = null;

  constructor(
    private _route: ActivatedRoute,
    private _offerModule: OfferModule,
    private _userModule: UserModule,
    private _alertsService: AlertService) {

    this.snapshot = _route.snapshot;
    this.allUsers = this.snapshot.data.userList;
    this.offerId = this.snapshot.data.offer.id;
    this.offer = this.snapshot.data.offer;

    this.actionType = (new EnumToArrayPipe()).transform(ActionPayoutTypeEnum);

    this.customPayoutActions = this.snapshot.data.users;

    this.customPayoutFormGroup = new FormGroup({
      'customUsersArray': new FormArray([]),
    });

    // Отсортировываем по userID наши кастомные выплаты
    this.customActionsByUser = ByOfferComponent.wrapCustomActions(this.customPayoutActions);

    let removedCount = 0;

    // Начинаем набивать форму
    this.allUsers.slice(0).forEach((user, index) => {

      // Если нет такого оффера в кастомах, то ничего не делаем
      if (!this.customActionsByUser[user.id]) {
        return;
      }

      // Иначе добавляем FormArray под оффер
      (<FormArray> this.customUsersArray).push(ByOfferComponent.addCustomPayoutsArray());

      // Набиваем FormArray c FormGroup по каждому действию

      let lastUser = this.getLastItem(this.customUsersArray);
      this.addAllActionsToArray(user, lastUser);
      let thisUserCustoms = this.customActionsByUser[user.id];

      // Апдейтим значения FormArray с customPay outs
      thisUserCustoms.forEach(payout => {
        let unique = true;
        lastUser.controls.forEach(control => {
          if (control.get('actionKey').value == payout.actionKey) {
            control.patchValue(payout);
            unique = false;
          }
        });
        if (unique) {
          lastUser.push(ByOfferComponent.addCustomPayoutAction(this.offer.id, this.offer.name, payout.key, user.mail, user.id));
          lastUser.controls[lastUser.length - 1].patchValue(payout);
          lastUser.controls[lastUser.length - 1].get('unique').setValue(true);
        }
      });

      this.outputedUsers[user.id] = user;
      this.allUsers.splice(index - removedCount, 1);
      removedCount++;
    });

  }

  get customUsersArray() {
    return this.customPayoutFormGroup.get('customUsersArray') as FormArray;
  }

  ngOnInit() {

  }

  static addCustomPayoutsArray(): FormArray {
    return new FormArray([]);
  }

  static addCustomPayoutAction(offerId: number, offerName: string, actionKey: string, userMail: string, userId: number): FormGroup {
    return new FormGroup({
      'id': new FormControl(null),
      'actionKey': new FormControl(actionKey),
      'offerId': new FormControl(offerId),
      'offerName': new FormControl(offerName),
      'unique': new FormControl(false),
      'userId': new FormControl(userId),
      'userMail': new FormControl(userMail),
      'payout': new FormControl(null),
      'payoutAdvert': new FormControl(null),
      'percent': new FormControl(null),
      'currentPayout': new FormControl(null),
      'currentPercent': new FormControl(null),
      'allowed': new FormControl(true)
    });
  }

  public addUserFormArray(formArray: FormArray) {
    (<FormArray> formArray).push(ByOfferComponent.addCustomPayoutsArray());
  }

  static wrapCustomActions(payouts: CustomPayout[]) {
    let wrappedPayouts = {};
    payouts.forEach(payout => {
      if (wrappedPayouts[payout.userId]) {
        wrappedPayouts[payout.userId].push(payout);
      } else {
        wrappedPayouts[payout.userId] = [];
        wrappedPayouts[payout.userId].push(payout);
      }
    });
    return wrappedPayouts;
  }

  public addUsers(mSelectElement) {
    let selected: User[] = [];

    for (let item of mSelectElement._model) {
      if (item.selected == true) {
        selected.push(item.value);
      }
    }

    if (selected.length == 0) {
      return;
    }

    selected.forEach(selectedUser => {

      this.addUserFormArray(this.customUsersArray);

      let lastUser = this.getLastItem(this.customUsersArray);
      lastUser.markAsTouched();

      this.addAllActionsToArray(selectedUser, lastUser);

      let removedCount = 0;

      this.updateUserSelect(mSelectElement);

      this.allUsers.slice(0).forEach((user, index) => {
        if (selectedUser.id == user.id) {
          this.outputedUsers[user.id] = user;
          this.allUsers.splice(index - removedCount, 1);
          removedCount++;
        }
      });
    });
  }

  public getLastItem(formArray: FormArray) {
    let lastUserId = (<FormArray> formArray).length - 1;
    return (<FormArray> (<FormArray> formArray).controls[lastUserId]);
  };

  public addAllActionsToArray(user: User, formArray: FormArray) {
    this.offer.actions.forEach(action => {
      formArray.push(ByOfferComponent.addCustomPayoutAction(this.offer.id, this.offer.name, action.key, user.mail, user.id));
    });
  }

  public deleteUser(index: number, mSelectElement) {

    // Точно удаляем?
    if (confirm('Are you sure you want delete that offer from custom payouts?')) {

      // Собираем массив для запроса
      let arrToSend = [];
      let userId: number = null;

      (<FormArray> this.customUsersArray.controls[index]).controls.forEach(action => {
        if (userId == null) {
          userId = action.get('userId').value;
        }
        if (action.get('id').value !== null) {
          arrToSend.push(action.get('id').value);
        }
      });

      // Шлём запрос

      this._offerModule.deleteCustomPayout(arrToSend)
        .then(() => {
          this._alertsService.addAlert('Пользователь удалён', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        })
        .catch(err => {
          this._alertsService.addAlert('Ошибка: ' + err.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        });

      // Добавить в выпадашку обратно оффер

      this.allUsers.push(this.outputedUsers[userId]);
      this.updateUserSelect(mSelectElement);

      // Ищем, удаляем нужные экшоны
      this.customUsersArray.removeAt(index);
    }
  };

  public onSendCustomPayout() {

    this.processing = true;

    // Добавим алоуеды и проценты

    this.customUsersArray.controls.forEach(user => {
      if (user.touched && user.valid) {

        let allowed = (<FormArray> user).controls[0].get('allowed').value;
        let percent = (<FormArray> user).controls[0].get('percent').value;

        (<FormArray> user).controls.forEach(action => {
          action.get('allowed').setValue(allowed);
          action.get('percent').setValue(percent);

          action.markAsTouched();
        });
      }
    });

    // Ищем потроганное, шлём

    let arrayToSend: CustomPayout[] = [];

    this.customUsersArray.controls.forEach(user => {
      (<FormArray> user).controls.forEach(action => {
        if (action.touched && action.valid) {

          let payout = (<FormGroup> action).getRawValue();

          if (payout.allowed == null) {
            payout.allowed = false;
          }

          payout.percent = +payout.percent;
          payout.payout = +payout.payout;

          delete payout['unique'];
          delete payout['id'];

          arrayToSend.push(payout);
        }
      });
    });

    this._offerModule.setCustomPayout(arrayToSend)
      .then(async () => {
        this._alertsService.addAlert('Персональные ставки сохранены', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        this.processing = false;
      })
      .catch(err => {
        this._alertsService.addAlert('Ошибка: ' + err.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        this.processing = false;
      });
  }

  public updateUserSelect(mSelectElement) {
    setTimeout(() => {
      mSelectElement._model = this.wrapModelArrayPipe.transform(this.allUsers);
      mSelectElement.selectionCount = 0;
    }, 0);
  }
}
