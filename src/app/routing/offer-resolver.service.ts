import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Offer } from '../models/offer';
import { OfferModule } from '../api/offer.module';

@Injectable({
  providedIn: 'root'
})
export class OfferResolverService implements Resolve<Offer> {

  constructor(
    private _offerModule: OfferModule,
    private _router: Router) {
  }

  async resolve(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Offer> {
    let offerId = parseInt(snapshot.paramMap.get('offerId') || snapshot.queryParamMap.get('offerId'));
    if (!offerId) {
      return null;
    }

    let offer;

    try {
      offer = await this._offerModule.getOffer(offerId);
      if (!offer) {

        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return offer;
    } catch (err) {

      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
