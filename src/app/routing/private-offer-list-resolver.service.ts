import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Offer } from '../models/offer';
import { OfferModule } from '../api/offer.module';

@Injectable({
  providedIn: 'root'
})
export class PrivateOfferListResolverService implements Resolve<Offer[]> {

  constructor(
    private _offerModule: OfferModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Offer[]> {
    let listPrivate;

    try {
      listPrivate = await this._offerModule.listPrivate(null);
      if (!listPrivate) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return listPrivate.items;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}

