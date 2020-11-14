import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Offer } from '../models/offer';
import { OfferModule } from '../api/offer.module';

@Injectable({
  providedIn: 'root'
})
export class MyOfferListResolverService implements Resolve<Offer[]> {

  constructor(
    private _offerModule: OfferModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Offer[]> {
    let myOffers;

    try {
      myOffers = await this._offerModule.listMy(null);
      if (!myOffers) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return myOffers.items;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}

