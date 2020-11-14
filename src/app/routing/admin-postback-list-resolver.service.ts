import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserLinksModule } from '../api/user-links.module';
import { Postback } from '../models/postback';

@Injectable({
  providedIn: 'root'
})
export class AdminPostbackListResolverService implements Resolve<Postback[]> {

  constructor(
    private _userLinksModule: UserLinksModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Postback[]> {
    let adminPostbackList;

    try {
      adminPostbackList = await this._userLinksModule.adminPostbackList(null);
      if (adminPostbackList) {
        return adminPostbackList.items;
      }
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}

