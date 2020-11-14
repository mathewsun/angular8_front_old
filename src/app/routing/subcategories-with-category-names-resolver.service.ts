import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { DictionaryModule } from '../api/dictionary.module';
import { OfferSubcategory } from '../models/offerSubcategory';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesWithCategoryNamesResolverService implements Resolve<OfferSubcategory[]> {

  constructor(
    private _dictionaryModule: DictionaryModule,
    private _router: Router) {
  }

  async resolve(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<OfferSubcategory[]> {
    let subcategoryList;
    let categoryList;
    try {
      subcategoryList = await this._dictionaryModule.listOfferSubcategories();
      if (!subcategoryList) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    try {
      categoryList = await this._dictionaryModule.listOfferCategories();
      if (!categoryList) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    let nameCollection = {};
    categoryList.forEach(el => {
      if (!nameCollection[el.id]) {
        nameCollection[el.id] = el.name;
      }
    });

    subcategoryList.map(el => {
      el.categoryName = nameCollection[el.categoryId];
      return el;
    });

    return subcategoryList;
  }
}
