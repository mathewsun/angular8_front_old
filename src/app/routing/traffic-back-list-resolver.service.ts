import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserLinksModule } from '../api/user-links.module';
import { Traffback } from '../models/traffback';

@Injectable({
  providedIn: 'root'
})
export class TrafficBackListResolverService implements Resolve<Traffback[]> {

  constructor(
    private _userLinksModule: UserLinksModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Traffback[]> {
    let traffbackList;

    try {
      traffbackList = await this._userLinksModule.traffbackList(null);
      if (!traffbackList) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return traffbackList.items;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}

