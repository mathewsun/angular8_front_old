import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserLinksModule } from '../api/user-links.module';
import { Traffback } from '../models/traffback';

@Injectable({
  providedIn: 'root'
})
export class TrafficBackResolverService implements Resolve<Traffback> {

  constructor(
    private _userLinksModule: UserLinksModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Traffback> {
    let traffback;

    if (!route.paramMap.get('linkType')) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    if (route.paramMap.get('linkType') !== 'traffback') {
      return null;
    }

    let traffbackId = parseInt(route.paramMap.get('linkId'));

    if (!traffbackId) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    try {
      traffback = await this._userLinksModule.getTraffback(traffbackId);
      if (!traffback) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return traffback;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
