import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserLinksModule } from '../api/user-links.module';
import { Postback } from '../models/postback';

@Injectable({
  providedIn: 'root'
})
export class PostbackListResolverService implements Resolve<Postback[]> {

  constructor(
    private _userLinksModule: UserLinksModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Postback[]> {
    let postbackList;

    try {
      postbackList = await this._userLinksModule.postbackList(null);
      if (!postbackList) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return postbackList.items;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}

