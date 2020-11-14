import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserLinksModule } from '../api/user-links.module';
import { Traffback } from '../models/traffback';

@Injectable({
  providedIn: 'root'
})
export class AdminTrafficBackListResolverService implements Resolve<Traffback[]> {

  constructor(
    private _userLinksModule: UserLinksModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Traffback[]> {
    let adminTraffbackList;

    try {
      adminTraffbackList = await this._userLinksModule.adminTraffbackList(null);
      if (adminTraffbackList) {
        return adminTraffbackList.items;
      }
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
