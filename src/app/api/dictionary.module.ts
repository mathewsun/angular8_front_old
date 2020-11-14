import { EventEmitter, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseApiModule } from './baseApi.module';
import { Currency } from '../models/currency';
import { TransportService } from '../services/transport/transport.service';
import { Role } from '../models/role';
import { Country } from '../models/country';
import { ApiResult } from '../models/apiResponse';
import { OfferCategory } from '../models/offerCategory';
import { OfferSubcategory } from '../models/offerSubcategory';
import { CacheService } from '../services/stogare/cache.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class DictionaryModule extends BaseApiModule {

  private static _currenciesUpdated: EventEmitter<Currency[]> = new EventEmitter<Currency[]>();
  private static _rolesUpdated: EventEmitter<Role[]> = new EventEmitter<Role[]>();
  private static _countriesUpdated: EventEmitter<Country[]> = new EventEmitter<Country[]>();

  constructor(_transportService: TransportService,
              private _cacheService: CacheService) {
    super(_transportService);
    DictionaryModule._currenciesUpdated.subscribe(data => {
      this.currenciesUpdated.emit(data);
    });

    DictionaryModule._rolesUpdated.subscribe(data => {
      this.rolesUpdated.emit(data);
    });

    this.update();
  }

  public async update() {
    this.updateCurrencies();
    this.updateRoles();
    this.updateCountries();
  }

  /**
   *
   */
  private static _currencies: Currency[];
  private static _currenciesDictionary: { [index: number]: Currency } = {};
  public currenciesUpdated: EventEmitter<Currency[]> = new EventEmitter<Currency[]>();

  public get currencies(): Currency[] {
    return DictionaryModule._currencies;
  };

  public get currenciesDictionary(): { [index: number]: Currency } {
    return DictionaryModule._currenciesDictionary;
  };

  private async updateCurrencies(): Promise<Currency[]> {

    let result = {body: null};

    if (this._cacheService.checkInSessionStorage('Dictionary/GetCurrencies')) {
      result.body = this._cacheService.getFromSessionStorage('Dictionary/GetCurrencies');
    } else {
      result = await this.sendRequest<Currency[]>('Dictionary/GetCurrencies', {});
    }

    DictionaryModule._currencies = result.body;

    DictionaryModule._currencies.forEach(c => {
      DictionaryModule._currenciesDictionary[c.id] = c;
    });

    DictionaryModule._currenciesUpdated.emit(result.body);

    this._cacheService.addToSessionStorage('Dictionary/GetCurrencies', result.body, null);

    return result.body;
  }

  /**
   *
   */
  private static _rolesUpdating: boolean = false;
  private static _roles: Role[];
  public rolesUpdated: EventEmitter<Role[]> = new EventEmitter<Role[]>();

  public get roles(): Role[] {
    return DictionaryModule._roles;
  };

  private async updateRoles(): Promise<Role[]> {

    let result = {body: null};

    if (this._cacheService.checkInSessionStorage('dictionary/getRoles')) {
      result.body = this._cacheService.getFromSessionStorage('dictionary/getRoles');
    } else {
      result = await this.sendRequest<Role[]>('dictionary/getRoles', {});
    }

    DictionaryModule._roles = result.body;
    DictionaryModule._rolesUpdated.emit(result.body);

    this._cacheService.addToSessionStorage('dictionary/getRoles', result.body, null);
    return result.body;
  }

  /**
   *
   */
  private static _countries: Country[];
  public countriesUpdated: EventEmitter<Country[]> = new EventEmitter<Country[]>();

  public get countries(): Country[] {
    return DictionaryModule._countries;
  };

  private async updateCountries(): Promise<Country[]> {

    let result = {body: null};

    if (this._cacheService.checkInSessionStorage('dictionary/getCountries')) {
      result.body = this._cacheService.getFromSessionStorage('dictionary/getCountries');
    } else {
      result = await this.sendRequest<Country[]>('dictionary/getCountries', {});
    }

    DictionaryModule._countries = result.body;
    DictionaryModule._countriesUpdated.emit(result.body);

    this._cacheService.addToSessionStorage('dictionary/getCountries', result.body, null);
    return result.body;
  }

  public async listOfferCategories(): Promise<OfferCategory[]> {
    try {
      if (this._cacheService.checkInSessionStorage('dictionary/GetOfferCategories')) {
        return this._cacheService.getFromSessionStorage('dictionary/GetOfferCategories');
      }
      let result: ApiResult<OfferCategory[]> = await this.sendRequest<OfferCategory[]>('dictionary/GetOfferCategories', null);
      this._cacheService.addToSessionStorage('dictionary/GetOfferCategories', result.body, null);
      return result.body;
    } catch (e) {
      return e;
    }
  }

  public async listOfferSubcategories(): Promise<OfferSubcategory[]> {
    try {
      if (this._cacheService.checkInSessionStorage('dictionary/GetOfferSubcategories')) {
        return this._cacheService.getFromSessionStorage('dictionary/GetOfferSubcategories');
      }
      let result: ApiResult<OfferSubcategory[]> = await this.sendRequest<OfferSubcategory[]>('dictionary/GetOfferSubcategories', null);
      this._cacheService.addToSessionStorage('dictionary/GetOfferSubcategories', result.body, null);
      return result.body;
    } catch (e) {
      return e;
    }
  }

}
