import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { OfferModule } from '../api/offer.module';
import { CustomPayout } from '../models/customPayout';

@Injectable({
  providedIn: 'root'
})
export class CustomPayoutResolverService implements Resolve<CustomPayout[]> {

  constructor(
    private _offerModule: OfferModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<CustomPayout[]> {
    let userId = parseInt(route.paramMap.get('userId'));
    let offerId = parseInt(route.paramMap.get('offerId'));

    if (!(userId || offerId)) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    let customPayout;
    try {
      customPayout = await this._offerModule.getCustomPayout(0, 9999999, offerId, userId);
      if (!customPayout) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return customPayout;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
