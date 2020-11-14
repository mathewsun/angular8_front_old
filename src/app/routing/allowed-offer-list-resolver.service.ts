import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Offer } from '../models/offer';
import { OfferModule } from '../api/offer.module';

@Injectable({
  providedIn: 'root'
})
export class AllowedOfferListResolverService implements Resolve<Offer[]> {

  constructor(
    private _offerModule: OfferModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Offer[]> {
    let listAllowed;

    try {
      listAllowed = await this._offerModule.listAllowed(null);
      if (listAllowed) {
        return listAllowed.items;
      }
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}

