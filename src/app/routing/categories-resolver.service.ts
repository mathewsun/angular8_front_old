import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { DictionaryModule } from '../api/dictionary.module';
import { OfferCategory } from '../models/offerCategory';

@Injectable({
  providedIn: 'root'
})
export class CategoriesResolverService implements Resolve<OfferCategory[]> {

  constructor(
    private _dictionaryModule: DictionaryModule,
    private _router: Router) {
  }

  async resolve(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<OfferCategory[]> {
    let categoryList;
    try {
      categoryList = await this._dictionaryModule.listOfferSubcategories();
      if (!categoryList) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return categoryList;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
