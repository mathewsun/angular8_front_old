import { Component, ComponentRef, OnDestroy, OnInit } from '@angular/core';
import { Stream } from '../../../models/stream';
import { FormControl, FormGroup } from '@angular/forms';
import { PopupInjectorService } from '../../../services/gui/popup-injector.service';
import { LinkBuilderModalComponent } from '../../../controls/modal/link-builder-modal/link-builder-modal.component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Offer } from '../../../models/offer';
import { DictionaryModule } from '../../../api/dictionary.module';
import { Country } from '../../../models/country';
import { StreamModule } from '../../../api/stream.module';
import { StreamFilter } from '../../../models/filters/stream.filter';
import { User } from '../../../models/user';
import { AlertService } from '../../../services/gui/alert.service';
import { AlertTypeEnum } from '../../../models/enums/alertType.enum';
import { StreamListTypeEnum } from '../../../models/enums/streamListType.enum';
import { StreamListService } from '../../../services/transport/stream-list.service';
import { WrapModelArrayPipe } from '../../../models/pipes/wrapModel.pipe';


@Component({
  selector: 'app-links',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css'],
  providers: [StreamListService]
})

export class StreamsComponent implements OnInit, OnDestroy {

  public environment = ENVIRONMENT;

  public streamList: Stream[] = [];
  public countries: Country[];

  public adminMode: boolean = false;

  public filtersFormGroup: FormGroup;

  private popupComponent: LinkBuilderModalComponent;
  private popupComponentRef: ComponentRef<LinkBuilderModalComponent>;

  public snapshot: ActivatedRouteSnapshot;

  public offerList: Offer[] = [];
  public userList: User[] = [];
  public forbiddenOfferIdList: number[] = [];

  public filterChanged: boolean = true;
  public type: StreamListTypeEnum = StreamListTypeEnum.Personal;

  public pageCount: number = 9;
  public pageSelected: number = 1;
  public itemsPerPage: number = 20;
  public filter: StreamFilter = {};

  public queryParamMapSubscription;
  public filtersFormSubscription;

  public wrapModelArray: WrapModelArrayPipe = new WrapModelArrayPipe();

  public loading = true;
  public schema: string = 'https';

  constructor(
    private _titleService: Title,
    private _activatedRoute: ActivatedRoute,
    private _streamModule: StreamModule,
    private _popupInjectorService: PopupInjectorService,
    private _dictionaryModule: DictionaryModule,
    private _alertService: AlertService,
    private _streamListService: StreamListService,
    private _router: Router,
  ) {

    this.snapshot = _activatedRoute.snapshot;
    this.offerList = this.snapshot.data.offerList;
    this.userList = this.snapshot.data.userList;

    this._titleService.setTitle(this.snapshot.data.title);
    this.adminMode = this.snapshot.data.adminMode;

    this.countries = this._dictionaryModule.countries;

    this.filtersFormGroup = new FormGroup({
      'offerListMS': new FormControl(null, {}),
      'countryListMS': new FormControl(null, {}),
      'webmasterListMS': new FormControl(null, {}),
      'searchInput': new FormControl(null, {}),
    });

    this.popupComponentRef = this._popupInjectorService.addComponent(LinkBuilderModalComponent);
    this.popupComponent = this.popupComponentRef.instance;

    this.type = this.snapshot.data.adminMode ? StreamListTypeEnum.Admin : StreamListTypeEnum.Personal;

    if (ENVIRONMENT.API_HOST.indexOf('api2.click2.money') === -1) {
      this.schema = 'http';
    }
  }

  get offerListMS() {
    return this.filtersFormGroup.get('offerListMS');
  }

  get countryListMS() {
    return this.filtersFormGroup.get('countryListMS');
  }

  get searchInput() {
    return this.filtersFormGroup.get('searchInput');
  }

  get webmasterListMS() {
    return this.filtersFormGroup.get('webmasterListMS');
  }

  ngOnInit() {

    // filling filter from query params
    this.updateFiltersFromQueryParams(this.snapshot.queryParamMap);

    // transforming country id list to country list
    let countryListDefaultValue: Country[] = null;
    if (this.filter.countries) {
      countryListDefaultValue = this.idsToStuffListConverter(this.filter.countries, this.countries);
    }

    // transforming offer id list to offer list
    let offerListDefaultValue: Offer[] = null;
    if (this.filter.offers) {
      offerListDefaultValue = this.idsToStuffListConverter(this.filter.offers, this.offerList);
    }

    // transforming user id list to user list
    let userListDefaultValue: User[] = null;
    if (this.adminMode) {
      if (this.filter.users) {
        userListDefaultValue = this.idsToStuffListConverter(this.filter.users, this.userList);
      }
    }

    // patching values in filters form
    this.searchInput.patchValue(this.filter.search ? this.filter.search : null);
    this.offerListMS.patchValue(offerListDefaultValue ? this.wrapModelArray.transform(offerListDefaultValue) : null);
    this.countryListMS.patchValue(countryListDefaultValue ? this.wrapModelArray.transform(countryListDefaultValue) : null);
    if (this.adminMode) {
      this.webmasterListMS.patchValue(userListDefaultValue ? this.wrapModelArray.transform(userListDefaultValue) : null);
    }

    // subscriptions to params switch
    this.queryParamMapSubscription = this._activatedRoute.queryParamMap.subscribe((answer) => {

      // updating page number from param query
      this.updatePageSelected(answer);

      this.loading = true;
      this.streamList = [];

      this._streamListService.getStreamList(this.type, this.filter, this.pageSelected, this.itemsPerPage).then(async res => {
        this.streamList = res.items;
        if (res.items.length == 0 && this.pageSelected !== 1) {
          this.addQueryParams(this.filter.search, this.filter.countries, this.filter.offers, this.filter.users, 1);
        } else {

          let pageCount = Math.ceil(res.itemsCount / this.itemsPerPage);

          if (pageCount == 0) {
            this.pageCount = 1;
          } else {
            this.pageCount = pageCount;
          }

          // checking for forbidden offers in streams
          this.checkForForbiddenOffers(this.streamList, this.offerList);

          this.loading = false;
        }
      }).catch(() => {
        this.loading = false;
      });
    });

    // subscription to filters change
    this.filtersFormSubscription = this.filtersFormGroup.valueChanges.subscribe(() => {
      this.toggleFilters();
    });

  }

  private checkForForbiddenOffers(streamList: Stream[], offerList: Offer[]) {
    this.forbiddenOfferIdList = [];

    for (let i = 0; i < streamList.length; i++) {
      for (let j = 0; j < streamList[i].offers.length; j++) {
        let forbidden: boolean = true;
        for (let k = 0; k < offerList.length; k++) {
          if (streamList[i].offers[j].id == offerList[k].id) {
            forbidden = false;
            break;
          }
        }
        if (forbidden) {
          this.forbiddenOfferIdList.push(streamList[i].offers[j].id);
        }
      }
    }
  }

  ngOnDestroy() {
    this.filtersFormSubscription.unsubscribe();
    this.queryParamMapSubscription.unsubscribe();
  }

  showLinkBuilder(streamId: string, streamName: string) {
    this.popupComponent.show(streamId, streamName);
  }

  // cross-platform solution for link copy (thx safari)

  public copyLink(link: string): void {
    let textArea;

    function isOS() {
      //can use a better detection logic here
      return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
      textArea = document.createElement('textArea');
      textArea.readOnly = true;
      textArea.contentEditable = true;
      textArea.value = text;
      document.body.appendChild(textArea);
    }

    function selectText() {
      let range, selection;

      if (isOS()) {
        range = document.createRange();
        range.selectNodeContents(textArea);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
      }
    }

    function copyTo() {
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    createTextArea(link);
    selectText();
    copyTo();
  }

  // public copyLink(event: MouseEvent, link: string): void {
  //
  //   event.preventDefault();
  //
  //   let listener = (e: ClipboardEvent) => {
  //     let clipboard = e.clipboardData || window['clipboardData'];
  //     clipboard.setData('text', link.toString());
  //     e.preventDefault();
  //   };
  //
  //   document.addEventListener('copy', listener, false);
  //   document.execCommand('copy');
  //   document.removeEventListener('copy', listener, false);
  //
  //   this._alertService.addAlert('Ссылка скопирована', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
  // }

  public updateFiltersInQueryParams() {

    if (!this.filterChanged) {
      return;
    }

    let filter: StreamFilter = {search: null, countries: [], offers: [], users: []};

    filter.search = this.searchInput.value;

    if (this.offerListMS.value) {
      this.offerListMS.value.forEach(wC => filter.offers.push(wC.value.id));
    }

    if (this.countryListMS.value) {
      this.countryListMS.value.forEach(wC => filter.countries.push(wC.value.id));
    }

    if (this.adminMode) {
      if (this.webmasterListMS.value) {
        this.webmasterListMS.value.forEach(wC => filter.users.push(wC.value.id));
      }
    }

    this.addQueryParams(filter.search, filter.countries, filter.offers, filter.users, 1);

    this.filter = filter;

    this.filterChanged = false;

  };

  public isForbidden(id: number = null) {
    for (var i = 0; i < this.forbiddenOfferIdList.length; i++) {
      if (id == this.forbiddenOfferIdList[i]) {
        return true;
      }
    }
    return false;
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

  updatePageSelected(e) {
    this.pageSelected = parseInt(e.get('page')) || 1;
  }

  updateFiltersFromQueryParams(e) {

    let filter: any = {};

    this.pageSelected = parseInt(e.get('page')) || 1;

    filter.search = e.get('search') || null;

    if (e.get('countries') == 'all' || e.get('countries') == null) {
      filter.countries = null;
    } else {
      filter.countries = e.get('countries').split(',').map(el => parseInt(el));
    }

    if (e.get('offers') == 'all' || e.get('offers') == null) {
      filter.offers = null;
    } else {
      filter.offers = e.get('offers').split(',').map(el => parseInt(el));
    }

    if (this.adminMode) {
      if (e.get('users') == 'all' || e.get('users') == null) {
        filter.users = null;
      } else {
        filter.users = e.get('users').split(',').map(el => parseInt(el));
      }
    }

    //updating this.filter
    this.filter = filter;
  }

  public clearFilters() {
    this.resetFormGroup(this.filtersFormGroup);
    this.toggleFilters();
    this.filter = {};
  }

  public toggleFilters() {
    this.filterChanged = true;
  }

  idsToStuffListConverter(ids: number[] = [], stuffWithIds: any[] = []) {
    let result: any[] = [];

    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < stuffWithIds.length; j++) {
        if (stuffWithIds[j].id == ids[i]) {
          result.push(stuffWithIds[j]);
          break;
        }
      }
    }
    return result;
  }

  public addQueryParams(search: string = null, countries: number[] = null, offers: number[] = null, users: number[] = null, page: number = 1) {
    let queryParams: any = {};

    if (search) {
      queryParams.search = search;
    }

    if (countries) {
      if (countries.length > 0 && countries.length < this.countries.length) {
        queryParams.countries = countries.join(',');
      }
    }

    if (offers) {
      if (offers.length > 0 && offers.length < this.offerList.length) {
        queryParams.offers = offers.join(',');
      }
    }

    if (users) {
      if (this.adminMode) {
        if (users.length > 0 && users.length < this.userList.length) {
          queryParams.users = users.join(',');
        }
      }
    }

    queryParams.page = page;

    this._router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: '',
    });
  }
}
