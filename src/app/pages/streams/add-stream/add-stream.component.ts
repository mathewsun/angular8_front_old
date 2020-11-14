import { AfterViewInit, Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { ApiModule } from '../../../api/api.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ModelWrapper } from '../../../models/modelWrapper';
import { Offer } from '../../../models/offer';
import { LandingPage } from '../../../models/landingPage';
import { Title } from '@angular/platform-browser';
import { OfferModule } from '../../../api/offer.module';
import { Country } from '../../../models/country';
import { DictionaryModule } from '../../../api/dictionary.module';
import { StreamModule } from '../../../api/stream.module';
import { WrapModelArrayPipe } from '../../../models/pipes/wrapModel.pipe';
import { MultiSelectComponent } from '../../../controls/multi-select/multi-select.component';
import { SelectComponent } from '../../../controls/select/select.component';
import { Traffback } from '../../../models/traffback';
import { Postback } from '../../../models/postback';
import { AlertTypeEnum } from '../../../models/enums/alertType.enum';
import { AlertService } from '../../../services/gui/alert.service';
import { OfferSubcategory } from '../../../models/offerSubcategory';

@Component({
  selector: 'app-add-stream',
  templateUrl: './add-stream.component.html',
  styleUrls: ['./add-stream.component.css']
})

export class AddStreamComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('offerSubcategorySelect', {static: false}) offerSubcategorySelectComponent: SelectComponent;
  @ViewChild('countriesMS', {static: false}) countriesMSComponent: MultiSelectComponent;
  @ViewChild('offersMS', {static: false}) offersMSComponent: MultiSelectComponent;

  public selectedLandingPages = {};
  public offerSubcategories: OfferSubcategory[];

  public selectedStream: any; // Stream
  public selectedOffer: Offer;

  public offers: Offer[];
  public selectedOffers: Offer[] = [];
  public disabledOffers: Offer[] = [];
  public filteredOffers: Offer[] = [];

  public countries: Country[];
  public selectedCountriesIds: { [id: number]: boolean };

  public chosenOfferId: number = null;

  public landingsDisplay: { [index: string]: ModelWrapper<LandingPage> } = {};

  public processing: boolean = false;

  public snapshot: ActivatedRouteSnapshot;

  public wrapModelArray: WrapModelArrayPipe = new WrapModelArrayPipe();

  public traffbackList: Traffback[] = [];
  public postbackList: Postback[] = [];

  constructor(
    private _dictionaryModule: DictionaryModule,
    private _titleService: Title,
    private _activatedRoute: ActivatedRoute,
    private _offerModule: OfferModule,
    private _apiModule: ApiModule,
    private _streamModule: StreamModule,
    private _router: Router,
    private _alertService: AlertService
  ) {

    this.snapshot = _activatedRoute.snapshot;

    this._titleService.setTitle(this.snapshot.data.title);

    this.offers = this.snapshot.data.offers;
    this.offerSubcategories = this.snapshot.data.subcategoryList;

    if (this.snapshot.data.mode == 'admin') {
      this.traffbackList = this.snapshot.data.adminStreamEditObj.traffbackList;
      this.postbackList = this.snapshot.data.adminStreamEditObj.postbackList;
    } else {
      this.traffbackList = this.snapshot.data.traffbackList;
      this.postbackList = this.snapshot.data.postbackList;
    }

    this.countries = this._dictionaryModule.countries;
    this._dictionaryModule.countriesUpdated.subscribe((newCountries: Country[]) => {
      this.countries = newCountries;
    });

    if (this.snapshot.paramMap.get('streamId')) {
      if (this.snapshot.data.mode == 'admin') {
        this.selectedStream = this.snapshot.data.adminStreamEditObj.stream;
      } else {
        this.selectedStream = this.snapshot.data.selectedStream;
      }
    }

    if (this.snapshot.queryParamMap.get('offerId')) {
      this.selectedOffer = this.snapshot.data.selectedOffer;
    }

  }

  private landingsCache: { [id: number]: ModelWrapper<LandingPage>[] } = {};

  newStreamForm: FormGroup;

  public landingChooser = {
    touched: false,
    invalid: true
  };


  ngOnInit() {

    if (this.snapshot.queryParamMap.get('offerId') && (!this.snapshot.data.edit)) {

      // **********************************
      // Adding stream by offer
      // **********************************

      let offerSubcategoryDV;
      let countriesDV;
      let offersDV;

      offerSubcategoryDV = this.selectedOffer.subcategoryId;

      if ((this.selectedOffer.countries.length === this.countries.length) || (this.selectedOffer.countries.length === 0)) {
        countriesDV = this.wrapModelArray.transform(this.countries);
      } else {
        countriesDV = this.wrapModelArray.transform(this.selectedOffer.countries);
      }

      offersDV = this.wrapModelArray.transform([this.selectedOffer]);

      this.newStreamForm = new FormGroup({
        'name': new FormControl(null, Validators.required),
        // 'tagsString': new FormControl(null),
        'traffbackLinkId': new FormControl(null),
        'postbackMS': new FormControl(null),
        'offersMS': new FormControl(null),
        'countriesMS': new FormControl(countriesDV || null),
        'offerSubcategory': new FormControl(offerSubcategoryDV || null),
        'id': new FormControl(null),
      });

      this.countriesMS.markAsTouched();
      this.offerSubcategory.markAsTouched();

      // Offers sorting

      this.onOffersFilter();

      // Choose current offer in MS

      this.offersMS.setValue(offersDV);
      this.offersMS.markAsTouched();

    } else if (this.snapshot.data.edit && this.snapshot.data.mode !== 'admin') {

      // **********************************
      // Editing existing stream
      // **********************************

      let offerSubcategoryDV;
      let countriesDV;
      let offersDV;
      let postbackDV;
      let traffbackDV;
      offerSubcategoryDV = this.selectedStream.offers[0].subcategoryId;

      let countriesHash: { [id: number]: Country } = {};

      this.selectedStream.offers.forEach(offer => {

        offer.countries.forEach(country => {
          if (!countriesHash[country.id]) {
            countriesHash[country.id] = country;
          }
        });
      });

      let thisCountries = Object.values(countriesHash);

      if ((thisCountries.length === this.countries.length) || (thisCountries.length === 0)) {
        countriesDV = this.wrapModelArray.transform(this.countries);
      } else {
        countriesDV = this.wrapModelArray.transform(thisCountries);
      }

      this.disabledOffers = [];

      for (var i = 0; i < this.selectedStream.offers.length; i++) {
        let forbidden = true;
        for (var j = 0; j < this.offers.length; j++) {
          if (this.selectedStream.offers[i].id == this.offers[j].id) {
            forbidden = false;
            break;
          }
        }
        if (forbidden) {
          this.disabledOffers.push(this.selectedStream.offers[i]);
          this.selectedStream.offers.splice(i, 1);
        }
      }

      let thisOffers = [];

      this.selectedStream.offers.forEach(offer => {
        thisOffers.push(offer);
      });

      offersDV = this.wrapModelArray.transform(thisOffers);
      postbackDV = this.wrapModelArray.transform(this.selectedStream.postbackLinks);

      if (this.selectedStream.traffbackLink) {
        traffbackDV = this.selectedStream.traffbackLink.id;
      } else {
        traffbackDV = null;
      }

      this.newStreamForm = new FormGroup({
        'name': new FormControl(this.selectedStream.name, Validators.required),
        // 'tagsString': new FormControl('' + this.selectedStream.tags),
        'traffbackLinkId': new FormControl(traffbackDV || null),
        'postbackMS': new FormControl(postbackDV || null),
        'offersMS': new FormControl(null),
        'countriesMS': new FormControl(countriesDV || null),
        'offerSubcategory': new FormControl(offerSubcategoryDV || null),
        'id': new FormControl(this.selectedStream.id),
      });

      // Offers sorting

      this.onOffersFilter();

      // Choose current offer in MS

      this.offersMS.setValue(offersDV);

      this.countriesMS.markAsTouched();
      this.offerSubcategory.markAsTouched();
      this.offersMS.markAsTouched();
      // this.tagsString.markAsTouched();
      this.name.markAsTouched();
      this.traffback.markAsTouched();
      this.postbackMS.markAsTouched();

    } else if (this.snapshot.data.edit && this.snapshot.data.mode == 'admin') {

      // **********************************
      // Admin editing existing stream
      // **********************************

      let offerSubcategoryDV;
      let countriesDV;
      let offersDV;
      let postbackDV;
      let traffbackDV;

      let adminStreamEditObj = this.snapshot.data.adminStreamEditObj;

      offerSubcategoryDV = adminStreamEditObj.stream.offers[0].subcategoryId;

      let countriesHash: { [id: number]: Country } = {};

      adminStreamEditObj.stream.offers.forEach(offer => {

        offer.countries.forEach(country => {
          if (!countriesHash[country.id]) {
            countriesHash[country.id] = country;
          }
        });
      });

      let thisCountries = Object.values(countriesHash);

      if ((thisCountries.length === this.countries.length) || (thisCountries.length === 0)) {
        countriesDV = this.wrapModelArray.transform(this.countries);
      } else {
        countriesDV = this.wrapModelArray.transform(thisCountries);
      }

      let thisOffers = [];

      adminStreamEditObj.stream.offers.forEach(offer => {
        thisOffers.push(offer);
      });

      offersDV = this.wrapModelArray.transform(thisOffers);
      postbackDV = this.wrapModelArray.transform(adminStreamEditObj.stream.postbackLinks);

      if (adminStreamEditObj.stream.traffbackLink) {
        traffbackDV = adminStreamEditObj.stream.traffbackLinkId;
      } else {
        traffbackDV = null;
      }

      this.newStreamForm = new FormGroup({
        'name': new FormControl(adminStreamEditObj.stream.name, Validators.required),
        // 'tagsString': new FormControl('' + adminStreamEditObj.stream.tags),
        'traffbackLinkId': new FormControl(traffbackDV || null),
        'postbackMS': new FormControl(postbackDV || null),
        'offersMS': new FormControl(null),
        'countriesMS': new FormControl(countriesDV || null),
        'offerSubcategory': new FormControl(offerSubcategoryDV || null),
        'id': new FormControl(adminStreamEditObj.stream.id),
      });

      // Offers sorting

      this.onOffersFilter();

      // Choose current offer in MS

      this.offersMS.setValue(offersDV);

      this.countriesMS.markAsTouched();
      this.offerSubcategory.markAsTouched();
      this.offersMS.markAsTouched();
      // this.tagsString.markAsTouched();
      this.name.markAsTouched();
      this.traffback.markAsTouched();
      this.postbackMS.markAsTouched();

    } else {

      // **********************************
      // New stream
      // **********************************

      this.newStreamForm = new FormGroup({
        'name': new FormControl(null, Validators.required),
        // 'tagsString': new FormControl(null),
        'traffbackLinkId': new FormControl(null),
        'postbackMS': new FormControl(null),
        'offersMS': new FormControl(null),
        'countriesMS': new FormControl(null),
        'offerSubcategory': new FormControl(null),
        'id': new FormControl(null),
      });

    }

  }

  ngAfterViewInit(): void {

    // **********************************
    // Adding event listeners to avoid resetting custom components
    // **********************************

    if (this.snapshot.queryParamMap.get('offerId') && (!this.snapshot.data.edit)) {

      // **********************************
      // Adding stream by offer, choosing offer to select landings
      // **********************************

      this.onLandingSelect(this.selectedOffer);

    } else if (this.snapshot.data.edit) {

      // **********************************
      // Editing existing stream
      // **********************************

      this.checkLandingPagesSelected();

      if (this.selectedStream.offers.length !== 0) {
        this.selectedStream.offers.forEach(offer => {
          this.filteredOffers.forEach(filteredOffer => {
            if (offer.id == filteredOffer.id) {
              this.onLandingSelect(filteredOffer);
            }
          });
        });
        this.selectedStream.offers.forEach(el => this.chooseLandingsOnEdit(el));
        this.onLandingSelect(this.selectedStream.offers[0]);
      }

      this.landingChooser.invalid = false;
      this.landingChooser.touched = true;

    }

    setTimeout(() => {
        this.offerSubcategorySelectComponent.change.subscribe(() => this.onOffersFilter());
        this.countriesMSComponent.valueChanged.subscribe(() => this.onOffersFilter());
        this.offersMSComponent.valueChanged.subscribe(() => this.onOffersSelect());
      }, 0
    );

  }

  get name(): any {
    return this.newStreamForm.get('name');
  };
  //
  // get tagsString(): any {
  //   return this.newStreamForm.get('tagsString');
  // };

  get traffback(): any {
    return this.newStreamForm.get('traffbackLinkId');
  };

  get postbackMS(): any {
    return this.newStreamForm.get('postbackMS');
  };

  get offersMS(): any {
    return this.newStreamForm.get('offersMS');
  };

  get countriesMS(): any {
    return this.newStreamForm.get('countriesMS');
  };

  get offerSubcategory(): any {
    return this.newStreamForm.get('offerSubcategory');
  };

  get id(): any {
    return this.newStreamForm.get('id');
  };

  onSubmit() {

    this.processing = true;
    this.markFormGroupTouched(this.newStreamForm);

    if (this.newStreamForm.invalid) {
      this.processing = false;
      return;
    }

    let newStream: any = {
      date: undefined,
      description: '',
      displayId: '',
      id: null,
      name: '',
      offers: undefined,
      // tags: [],
      user: undefined,
      traffbackLinkId: null,
    };

    newStream.name = this.name.value;

    newStream.traffbackLinkId = this.traffback.value;

    newStream.id = this.id.value;

    // let tagString: string = this.tagsString.value || '';
    //
    // newStream.tags =
    //   tagString.split(',')
    //     .map(t => {
    //       return t.trim();
    //     })
    //     .filter(t => !!t);

    let landingsToSend = {};

    this.selectedOffers.forEach(o => {
      if (this.landingsCache[o.id]) {
        this.landingsCache[o.id].filter(el => el.selected).forEach(el => {
          if (!landingsToSend[o.id]) {
            landingsToSend[o.id] = [];
          }
          landingsToSend[o.id].push(el.value);
        });
      }
    });

    if (Object.keys(landingsToSend).length == 0) {
      this.landingChooser.invalid = true;
      this.landingChooser.touched = true;
      this.processing = false;
      return;
    }

    let postbacksToSend: number[] = [];

    this.postbackMS.value.forEach(modelEl => {
      if (modelEl.selected) {
        postbacksToSend.push(modelEl.value.id);
      }
    });

    if (this.snapshot.data.edit) {
      this._streamModule.updateStream(newStream, landingsToSend, postbacksToSend)
        .then(() => {
          this._alertService.addAlert('Изменения в потоке сохранены', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
          this._router.navigate(['/dashboard/streams']);
        })
        .catch(err => {
          this._alertService.addAlert('Ошибка: ' + err.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
          this.processing = false;
        });
    } else {
      this._streamModule.createStream(newStream, landingsToSend, postbacksToSend)
        .then(() => {
          this._alertService.addAlert('Поток сохранен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
          this._router.navigate(['/dashboard/streams']);
        })
        .catch(err => {
          this._alertService.addAlert('Ошибка: ' + err.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
          this.processing = false;
        });
    }
  }

  /**
   *
   */
  onOffersSelect() {
    let newOffers = [];
    this.offersMS.value.map(el => newOffers.push(el.value));
    this.selectedOffers = newOffers;
  }

  /**
   *
   */
  onOffersFilter() {

    this.landingsCache = {};
    this.landingsDisplay = {};
    this.chosenOfferId = null;
    this.selectedCountriesIds = {};

    this.landingChooser.touched = false;
    if (this.countriesMS.value) {
      this.countriesMS.value.forEach(el => this.selectedCountriesIds[el.value.id] = true);
    }

    this.filteredOffers = [];
    if (this.offers) {
      this.filteredOffers = this.offers.filter(el => el.subcategoryId == this.offerSubcategory.value);
    }
    let selectCounter: number = null;
    if (this.countriesMS.value) {
      selectCounter = this.countriesMS.value.length || 0;
    }
    if (selectCounter == 0) {
      this.filteredOffers = [];
    }
    if (this.countries.length !== selectCounter) {
      this.filteredOffers = this.filteredOffers.filter(
        offer => {
          if (offer.countries.length == 0) {
            return true;
          } else {
            for (var i = 0; i < offer.countries.length; i++) {
              if (this.selectedCountriesIds[offer.countries[i].id]) {
                return true;
              }
            }
          }
        }
      );
    }

    setTimeout(() => {
      this.onOffersSelect();
    }, 0);
  }

  checkLandingPagesSelected() {
    this.selectedLandingPages = {};
    this.selectedOffers.forEach(o => {
      if (this.landingsCache[o.id]) {
        this.landingsCache[o.id].filter(el => el.selected).forEach(el => {
          if (!this.selectedLandingPages[o.id]) {
            this.selectedLandingPages[o.id] = [];
          }
          this.selectedLandingPages[o.id].push(el.value);
        });
      }
    });

    if (Object.keys(this.selectedLandingPages).length == 0) {
      this.landingChooser.invalid = true;
      this.landingChooser.touched = true;
      return;
    } else {
      this.landingChooser.invalid = false;
      this.landingChooser.touched = true;
    }

  }

  onLandingSelect(offer: Offer) {

    this.chosenOfferId = offer.id;
    this.landingsDisplay = {};

    let lps;

    if (this.landingsCache[offer.id]) {
      lps = this.landingsCache[offer.id];
    } else {
      lps = ModelWrapper.wrapArray(offer.landingPages);
      this.landingsCache[offer.id] = lps;
    }

    this.landingsDisplay = lps;
  }

  chooseLandingsOnEdit(offer: Offer) {

    offer.landingPages.forEach(o => {
      this.landingsCache[offer.id].forEach(
        el => {
          if (el.value.id == o.id) {
            el.selected = true;
          }
        }
      );
    });

  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any> Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }


  ngOnDestroy(): void {
    this.offerSubcategorySelectComponent.change.unsubscribe();
    this.countriesMSComponent.valueChanged.unsubscribe();
    this.offersMSComponent.valueChanged.unsubscribe();
  }

}
