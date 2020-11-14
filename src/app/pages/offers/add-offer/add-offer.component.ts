import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { OfferVisibilityEnum } from '../../../models/enums/offerVisibility.enum';
import { ActionPayoutTypeEnum } from '../../../models/enums/actionPayoutType.enum';
import { ModelWrapper } from '../../../models/modelWrapper';
import { LandingPage } from '../../../models/landingPage';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { DictionaryModule } from '../../../api/dictionary.module';
import { Currency } from '../../../models/currency';
import { Offer } from '../../../models/offer';
import { Country } from '../../../models/country';
import { Title } from '@angular/platform-browser';
import { LandingPageModule } from '../../../api/landingPage.module';
import { WrapModelArrayPipe } from '../../../models/pipes/wrapModel.pipe';
import { OfferModule } from '../../../api/offer.module';
import { AlertService } from '../../../services/gui/alert.service';
import { AlertTypeEnum } from '../../../models/enums/alertType.enum';
import { OfferSubcategory } from '../../../models/offerSubcategory';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.css']
})
export class AddOfferComponent implements OnInit {

  public snapshot: ActivatedRouteSnapshot;

  public offerSubcategories: OfferSubcategory[];
  public offerList: Offer[] = [];

  constructor(
    private _titleService: Title,
    private _route: ActivatedRoute,
    private _landingPageModule: LandingPageModule,
    private _offerModule: OfferModule,
    private _router: Router,
    private _dictionaryModule: DictionaryModule,
    private _alertService: AlertService
  ) {
    this.snapshot = _route.snapshot;
    this.offerList = this.snapshot.data.offerList;
    this.offerSubcategories = this.snapshot.data.subcategoryList;
    this._titleService.setTitle(this.snapshot.data.title);
  }

  public offerVisibilityEnum = OfferVisibilityEnum;
  public actionPayoutTypeEnum = ActionPayoutTypeEnum;
  public countries: Country[];

  public processing: boolean = false;
  public currencies: Currency[] = [];

  public landingPageSelector = {
    touched: false,
  };

  public wrapModelArray: WrapModelArrayPipe = new WrapModelArrayPipe();

  newOfferForm: FormGroup;

  public landingPages: { [index: string]: ModelWrapper<LandingPage> } = {};


  ngOnInit() {

    this._landingPageModule.listUnusedLandingPages()
      .then(result => {
        let wrappedArray = ModelWrapper.wrapArray(result);

        wrappedArray.forEach(wi => {
          this.landingPages[wi.value.id] = wi;
        });

      })
      .catch(e => {
        console.log(e);
      });

    this.currencies = this._dictionaryModule.currencies;
    this._dictionaryModule.currenciesUpdated.subscribe((newCurrencies: Currency[]) => {
      this.currencies = newCurrencies;
    });

    this.countries = this._dictionaryModule.countries;
    this._dictionaryModule.countriesUpdated.subscribe((newCountries: Country[]) => {
      this.countries = newCountries;
    });

    this.newOfferForm = new FormGroup({
      'id': new FormControl(null),
      'userId': new FormControl(null),
      'displayId': new FormControl(null),
      'name': new FormControl(null, Validators.required),
      'image': new FormControl(null, Validators.required),
      'description': new FormControl('', Validators.required),
      'shortDescription': new FormControl('', [Validators.required, Validators.maxLength(250)]),
      'subcategoryId': new FormControl(null, Validators.required),
      'visibility': new FormControl(null, Validators.required),
      'enabled': new FormControl(true),
      'currencyId': new FormControl(null, Validators.required),
      'countries': new FormControl(null),
      'fallbackOfferId': new FormControl(null),
      'actions': new FormArray([], Validators.required),
      'trafficSources': new FormControl('00000000000000000'),
    });

    // Editing mode

    if (this.snapshot.data.edit) {

      let offer: Offer = this.snapshot.data.offer;

      this.newOfferForm.get('actions').setValue([]);
      offer.actions.forEach((a) => {

        let related = a.relatedActionKey;
        let index = 0;
        offer.actions.forEach((action, jndex) => {
          if (action.key == related) {
            index = jndex + 1;
          }
        });
        (<FormArray> this.newOfferForm.get('actions')).push(AddOfferComponent.addActionGroup(related, index));
        this.newOfferForm.markAllAsTouched();
      });
      this.newOfferForm.patchValue(offer);

      for (let page of offer.landingPages) {

        let wrappedPage = new ModelWrapper<LandingPage>(page);
        wrappedPage.selected = true;
        this.landingPages[page.id] = wrappedPage;
      }
      if (offer.countries.length == 0) {

        this.geo.patchValue(this.wrapModelArray.transform(this.countries));
      } else {
        this.geo.patchValue(this.wrapModelArray.transform(offer.countries));
      }
      this.markFormGroupTouched(this.newOfferForm);

      this.checkAvailability();

    } else {
      this.onAddAction();
    }

  }

  get name() {
    return this.newOfferForm.get('name');
  };

  get image() {
    return this.newOfferForm.get('image');
  };

  get description() {
    return this.newOfferForm.get('description');
  };

  get shortDescription() {
    return this.newOfferForm.get('shortDescription');
  };

  get subcategoryId() {
    return this.newOfferForm.get('subcategoryId');
  };

  get visibility() {
    return this.newOfferForm.get('visibility');
  };

  get currencyId() {
    return this.newOfferForm.get('currencyId');
  };

  get actions() {
    return this.newOfferForm.get('actions');
  };

  get geo() {
    return this.newOfferForm.get('countries');
  };

  get trafficSources() {
    return this.newOfferForm.get('trafficSources');
  };

  get actionControls() {
    return (<FormArray> this.newOfferForm.get('actions')).controls;
  };

  get fallbackOfferId() {
    return this.newOfferForm.get('fallbackOfferId');
  };

  get enabled() {
    return this.newOfferForm.get('enabled');
  };

  onSubmit() {

    this.processing = true;
    this.markFormGroupTouched(this.newOfferForm);

    if (this.newOfferForm.invalid) {
      this.processing = false;
      return;
    }

    let chosenLandings = [];

    // *****************
    // Forming object to send

    for (let page of Object.values<ModelWrapper<LandingPage>>(this.landingPages)) {
      if (page.selected) {
        chosenLandings.push(page.value.id);
      }
    }

    if (chosenLandings.length == 0) {
      this.landingPageSelector.touched = false;
      this.processing = false;
      return;
    }

    let objToSend: any = {};

    objToSend.offer = this.newOfferForm.getRawValue()

    objToSend.offer.fallbackOfferId = +objToSend.offer.fallbackOfferId;
    objToSend.offer.currencyId = +objToSend.offer.currencyId;
    objToSend.offer.subcategoryId = +objToSend.offer.subcategoryId;
    objToSend.offer.visibility = +objToSend.offer.visibility;

    objToSend.landingPages = chosenLandings;

    let countries: Country[] = [];
    objToSend.offer.countries.forEach(wc => {
      countries.push(wc.value);
    });
    objToSend.offer.countries = countries;

    if (objToSend.offer.countries.length == this._dictionaryModule.countries.length) {
      objToSend.offer.countries = null;
    }

    if (this.snapshot.data.edit) {
      this._offerModule.offerUpdate(objToSend).then(async () => {
        this._alertService.addAlert('Оффер сохранен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        await this._router.navigate(['/dashboard/offers/all']);
        this.processing = true;
      })
        .catch((el) => {
          this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
          this.processing = false;
        });
    } else {
      this._offerModule.offerCreate(objToSend).then(async () => {
        this._alertService.addAlert('Оффер добавлен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        await this._router.navigate(['/dashboard/offers/all']);
        this.processing = true;
      })
        .catch((el) => {
          this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
          this.processing = false;
        });
    }
  }

  static addActionGroup(related: string = null, relatedIndex: number = 0): FormGroup {
    return new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.maxLength(128)]),
      'payout': new FormControl('', [Validators.required, Validators.pattern('^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$'), Validators.maxLength(16)]),
      'key': new FormControl('', [Validators.required, Validators.maxLength(16)]),
      'type': new FormControl(ActionPayoutTypeEnum.Payout, Validators.required),
      'allowPayoutOverride': new FormControl(false, Validators.required),
      'relatedActionKey': new FormControl(related),
      'relatedIndex': new FormControl(relatedIndex)
    });
  }

  trackByFnActions(index: any) {
    return index;
  }

  onDeleteAction(id) {
    (<FormArray> this.newOfferForm.get('actions')).removeAt(id);
  }


  onAddAction() {
    (<FormArray> this.newOfferForm.get('actions')).push(AddOfferComponent.addActionGroup());
  }

  public checkAvailability() {

    setTimeout(() => {
      if (this.snapshot.data.edit) {
        if (this.visibility.value+'' !== '0' || !this.enabled.value) {
          this.fallbackOfferId.setValidators([Validators.required]);
          this.fallbackOfferId.updateValueAndValidity();
        } else {
          this.fallbackOfferId.setValidators(null)
          this.fallbackOfferId.updateValueAndValidity();
        }
      }
    }, 0);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any> Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }

    });
  }

}
