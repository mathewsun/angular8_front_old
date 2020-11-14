import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { OfferSubcategory } from '../models/offerSubcategory';
import { DictionaryModule } from '../api/dictionary.module';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesResolverService implements Resolve<OfferSubcategory[]> {

  constructor(
    private _dictionaryModule: DictionaryModule,
    private _router: Router) {
  }

  async resolve(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<OfferSubcategory[]> {
    let subcategoryList;
    try {
      subcategoryList = await this._dictionaryModule.listOfferSubcategories();
      if (!subcategoryList) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return subcategoryList;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
