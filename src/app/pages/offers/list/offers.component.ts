import { Component, ComponentRef, OnDestroy, OnInit } from '@angular/core';
import { Offer } from '../../../models/offer';
import { DictionaryModule } from '../../../api/dictionary.module';
import { Currency } from '../../../models/currency';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { OfferModule } from '../../../api/offer.module';
import { Title } from '@angular/platform-browser';
import { RequestAccessModalComponent } from '../../../controls/modal/request-access-modal/request-access-modal.component';
import { PopupInjectorService } from '../../../services/gui/popup-injector.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Country } from '../../../models/country';
import { OfferFilter } from '../../../models/filters/offer.filter';
import { OfferListTypeEnum } from '../../../models/enums/offerListType.enum';
import { OfferListService } from '../../../services/transport/offer-list.service';
import { WrapModelArrayPipe } from '../../../models/pipes/wrapModel.pipe';
import { OfferSubcategory } from '../../../models/offerSubcategory';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
  providers: [OfferListService]
})

export class OffersComponent implements OnInit, OnDestroy {

  headElements = ['Id', ' ', 'Name', 'Category', 'Country', 'Action', 'Payout', 'AR', 'EPC', ' '];

  public filtersFormGroup: FormGroup;
  public offerSubcategories: OfferSubcategory[];

  public offers: Offer[];

  public currencies: { [id: number]: Currency } = {};

  public route: string;

  public snapshot: ActivatedRouteSnapshot;

  private popupComponent: RequestAccessModalComponent;
  private popupComponentRef: ComponentRef<RequestAccessModalComponent>;

  public countries: Country[] = this._dictionaryModule.countries;

  public filterChanged: boolean = true;
  public type: OfferListTypeEnum = OfferListTypeEnum.All;

  // paginator variables

  public pageCount: number = 9;
  public pageSelected: number = 1;
  public itemsPerPage: number = 20;
  public filter: OfferFilter = {};

  public wrapModelArray: WrapModelArrayPipe = new WrapModelArrayPipe();

  // subscriptions

  public queryParamMapSubscription;
  public filtersFormSubscription;

  public loading = true;
  public unhiddenCountries = new Set();

  constructor(
    private _popupInjectorService: PopupInjectorService,
    private _titleService: Title,
    private _dictionaryModule: DictionaryModule,
    private _offerModule: OfferModule,
    private _activatedRoute: ActivatedRoute,
    private _offerListService: OfferListService,
    private _router: Router,
  ) {

    this.snapshot = _activatedRoute.snapshot;

    this._titleService.setTitle(this.snapshot.data.title);

    this.offerSubcategories = this.snapshot.data.subcategoryList;
    this.type = this.snapshot.data.type;

    _dictionaryModule.currencies.forEach(c => {
      this.currencies[c.id] = c;
    });

    this.popupComponentRef = this._popupInjectorService.addComponent(RequestAccessModalComponent);
    this.popupComponent = this.popupComponentRef.instance;

    this.filtersFormGroup = new FormGroup({
      'searchInput': new FormControl(null),
      'categorySelect': new FormControl(null),
      'countryListMS': new FormControl(null)
    });
  }

  showRequestAccessPopup(offer: Offer) {
    this.popupComponent.show(offer);
  }

  ngOnInit() {

    // filling filter from query params
    this.updateFiltersFromQueryParams(this.snapshot.queryParamMap);

    // transforming country id list to country list
    let countryListDefaultValue: Country[] = null;
    if (this.filter.countries) {
      countryListDefaultValue = this.countryListWrapper(this.filter.countries);
    }

    // patching values in filters form
    this.searchInput.patchValue(this.filter.search ? this.filter.search : null);

    this.categorySelect.patchValue(this.filter.offerSubcategories ? this.filter.offerSubcategories[0] : null);
    this.countryListMS.patchValue(countryListDefaultValue ? this.wrapModelArray.transform(countryListDefaultValue) : null);

    // subscriptions to params change
    this.queryParamMapSubscription = this._activatedRoute.queryParamMap.subscribe((answer) => {

      // updating page number from param query
      this.updatePageSelected(answer);

      this.loading = true;
      this.offers = [];

      this._offerListService.getOfferList(this.type, this.filter, this.pageSelected, this.itemsPerPage).then(async res => {
        this.offers = res.items;

        if (res.items.length == 0 && this.pageSelected !== 1) {
          this.addQueryParams(this.filter.search, this.filter.countries, this.filter.offerSubcategories, 1);
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

      this.unhiddenCountries.clear();
    });

    // subscription to filters change
    this.filtersFormSubscription = this.filtersFormGroup.valueChanges.subscribe(() => {
      this.toggleFilters();
    });
  }

  ngOnDestroy() {
    this.filtersFormSubscription.unsubscribe();
    this.queryParamMapSubscription.unsubscribe();
  }

  get searchInput() {
    return this.filtersFormGroup.get('searchInput') as FormControl;
  }

  get categorySelect() {
    return this.filtersFormGroup.get('categorySelect') as FormControl;
  }

  get countryListMS() {
    return this.filtersFormGroup.get('countryListMS') as FormControl;
  }

  public toggleFilters() {
    this.filterChanged = true;
  }

  public addQueryParams(search: string = null, countries: number[] = null, subcategory: number[] = null, page: number = 1) {

    let queryParams: any = {};

    if (search) {
      queryParams.search = search;
    }

    if (countries) {
      if (countries.length > 0 && countries.length < this.countries.length) {
        queryParams.countries = countries.join(',');
      }
    }

    if (subcategory) {
      if (subcategory.length > 0) {
        queryParams.category = subcategory.join(',');
      }
    }

    queryParams.page = page;

    this._router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: '',
    });
  }

  public updateFiltersInQueryParams() {

    if (!this.filterChanged) {
      return;
    }

    let filter: OfferFilter = {search: null, countries: [], offerSubcategories: []};

    filter.search = this.searchInput.value;

    if (this.countryListMS.value) {
      this.countryListMS.value.forEach(wC => filter.countries.push(wC.value.id));
    }

    if (this.categorySelect.value !== '9000' && this.categorySelect.value !== null) {
      filter.offerSubcategories = [parseInt(this.categorySelect.value)];
    }

    this.addQueryParams(filter.search, filter.countries, filter.offerSubcategories, 1);

    this.filter = filter;

    this.filterChanged = false;
  };

  public clearFilters() {
    this.resetFormGroup(this.filtersFormGroup);
    this.toggleFilters();
    this.filter = {};
  }

  public resetFormGroup(formGroup: FormGroup) {
    (<any> Object).values(formGroup.controls).forEach(control => {
      control.reset();

      if (control.controls) {
        this.resetFormGroup(control);
      }

    });
    this.categorySelect.setValue('9000');
  }

  updatePageSelected(e) {
    this.pageSelected = parseInt(e.get('page')) || 1;
  }

  updateFiltersFromQueryParams(e) {
    let filter: any = {};

    if (e.get('countries') == 'all' || e.get('countries') == null) {
      filter.countries = null;
    } else {
      filter.countries = e.get('countries').split(',').map(el => parseInt(el));
    }
    if (e.get('category') == 'all' || e.get('category') == null) {
      filter.offerSubcategories = null;
    } else {
      filter.offerSubcategories = [parseInt(e.get('category'))];
    }
    filter.search = e.get('search') || null;
    //updating this.filter
    this.filter = filter;
  }

  countryListWrapper(countryIds: number[] = []) {
    let countryList: Country[] = [];
    let allCountries: Country[] = this.countries;

    countryIds.map(id => {
      countryList.push(allCountries[id - 1]);
    });

    return countryList;
  }
}
