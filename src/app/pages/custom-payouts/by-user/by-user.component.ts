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
  selector: 'app-by-user',
  templateUrl: './by-user.component.html',
  styleUrls: ['./by-user.component.css']
})

export class ByUserComponent implements OnInit {

  @ViewChild('offersSelect', {
    static: true,
    read: MultiSelectComponent
  }) offersSelect: MultiSelectComponent;

  public allOffers: Offer[] = [];
  public customPayoutActions: CustomPayout[] = [];
  public customActionsByOffer = {};
  public outputedOffers = {};

  public snapshot: ActivatedRouteSnapshot;

  public customPayoutFormGroup: FormGroup;
  public wrapModelArrayPipe = new WrapModelArrayPipe;

  public actionType: Array<string>;

  public processing: boolean = false;

  public user: User = null;
  public userId: number = null;

  constructor(
    private _route: ActivatedRoute,
    private _offerModule: OfferModule,
    private _userModule: UserModule,
    private _alertsService: AlertService) {

    this.snapshot = _route.snapshot;
    this.allOffers = this.snapshot.data.offerList;
    this.userId = this.snapshot.data.profile.userId;
    this.user = this.snapshot.data.profile;

    this.actionType = (new EnumToArrayPipe()).transform(ActionPayoutTypeEnum);

    this.customPayoutActions = this.snapshot.data.offers;

    this.customPayoutFormGroup = new FormGroup({
      'customOffersArray': new FormArray([]),
    });

    // Отсортировываем по offerID наши кастомные выплаты
    this.customActionsByOffer = ByUserComponent.wrapCustomActions(this.customPayoutActions);

    let removedCount = 0;

    // Начинаем набивать форму
    this.allOffers.slice(0).forEach((offer, index) => {

      // Если нет такого оффера в кастомах, то ничего не делаем
      if (!this.customActionsByOffer[offer.id]) {
        return;
      }

      // Иначе добавляем FormArray под оффер
      (<FormArray> this.customOffersArray).push(ByUserComponent.addCustomPayoutsArray());

      // Набиваем FormArray c FormGroup по каждому действию

      let lastOffer = this.getLastItem(this.customOffersArray);
      this.addAllActionsToArray(offer, lastOffer);
      let thisOfferCustoms = this.customActionsByOffer[offer.id];

      // Апдейтим значения FormArray с customPayouts
      thisOfferCustoms.forEach(payout => {
        let unique = true;
        lastOffer.controls.forEach(control => {
          if (control.get('actionKey').value == payout.actionKey) {
            control.patchValue(payout);
            unique = false;
          }
        });
        if (unique) {
          lastOffer.push(ByUserComponent.addCustomPayoutAction(offer.id, offer.name, payout.key, this.user.mail, this.user.id));
          lastOffer.controls[lastOffer.length - 1].patchValue(payout);
          lastOffer.controls[lastOffer.length - 1].get('unique').setValue(true);
        }
      });

      this.outputedOffers[offer.id] = offer;
      this.allOffers.splice(index - removedCount, 1);
      removedCount++;
    });

  }

  get customOffersArray() {
    return this.customPayoutFormGroup.get('customOffersArray') as FormArray;
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
      'percent': new FormControl(null),
      'currentPayout': new FormControl(null),
      'currentPercent': new FormControl(null),
      'allowed': new FormControl(true)
    });
  }

  public addOfferFormArray(formArray: FormArray) {
    (<FormArray> formArray).push(ByUserComponent.addCustomPayoutsArray());
  }

  static wrapCustomActions(payouts: CustomPayout[]) {
    let wrappedPayouts = {};
    payouts.forEach(payout => {
      if (wrappedPayouts[payout.offerId]) {
        wrappedPayouts[payout.offerId].push(payout);
      } else {
        wrappedPayouts[payout.offerId] = [];
        wrappedPayouts[payout.offerId].push(payout);
      }
    });
    return wrappedPayouts;
  }

  public addOffers(mSelectElement) {
    let selected: Offer[] = [];

    for (let item of mSelectElement._model) {
      if (item.selected == true) {
        selected.push(item.value);
      }
    }

    if (selected.length == 0) {
      return;
    }

    selected.forEach(selectedOffer => {

      this.addOfferFormArray(this.customOffersArray);

      let lastOffer = this.getLastItem(this.customOffersArray);
      lastOffer.markAsTouched();

      this.addAllActionsToArray(selectedOffer, lastOffer);

      this.updateOfferSelect(mSelectElement);

      let removedCount = 0;

      this.allOffers.slice(0).forEach((offer, index) => {
        if (selectedOffer.id == offer.id) {
          this.outputedOffers[offer.id] = offer;
          this.allOffers.splice(index - removedCount, 1);
          removedCount++;
        }
      });
    });
  }

  public getLastItem(formArray: FormArray) {
    let lastOfferId = (<FormArray> formArray).length - 1;
    return (<FormArray> (<FormArray> formArray).controls[lastOfferId]);
  };

  public addAllActionsToArray(offer: Offer, formArray: FormArray) {
    offer.actions.forEach(action => {
      formArray.push(ByUserComponent.addCustomPayoutAction(offer.id, offer.name, action.key, this.user.mail, this.user.id));
    });
  }

  public deleteOffer(index: number, mSelectElement) {

    // Точно удаляем?
    if (confirm('Are you sure you want delete that offer from custom payouts?')) {

      // Собираем массив для запроса
      let arrToSend = [];
      let offerId: number = null;

      (<FormArray> this.customOffersArray.controls[index]).controls.forEach(action => {
        if (offerId == null) {
          offerId = action.get('offerId').value;
        }
        if (action.get('id').value !== null) {
          arrToSend.push(action.get('id').value);
        }
      });

      // Шлём запрос

      this._offerModule.deleteCustomPayout(arrToSend)
        .then(() => {
          this._alertsService.addAlert('Оффер удалён', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        })
        .catch(err => {
          this._alertsService.addAlert('Ошибка: ' + err.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        });

      // Добавить в выпадашку обратно оффер

      this.allOffers.push(this.outputedOffers[offerId]);
      this.updateOfferSelect(mSelectElement);

      // Ищем, удаляем нужные экшоны
      this.customOffersArray.removeAt(index);
    }
  };

  public onSendCustomPayout() {

    this.processing = true;

    // Добавим алоуеды и проценты

    this.customOffersArray.controls.forEach(offer => {
      if (offer.touched && offer.valid) {

        let allowed = (<FormArray> offer).controls[0].get('allowed').value;
        let percent = (<FormArray> offer).controls[0].get('percent').value;

        (<FormArray> offer).controls.forEach(action => {
          action.get('allowed').setValue(allowed);
          action.get('percent').setValue(percent);

          action.markAsTouched();
        });
      }
    });

    // Ищем потроганное, шлём

    let arrayToSend: CustomPayout[] = [];

    this.customOffersArray.controls.forEach(offer => {
      (<FormArray> offer).controls.forEach(action => {
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

  public updateOfferSelect(mSelectElement) {
    setTimeout(() => {
      mSelectElement._model = this.wrapModelArrayPipe.transform(this.allOffers);
      mSelectElement.selectionCount = 0;
    }, 0);
  }
}
