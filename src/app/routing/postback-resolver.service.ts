import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Postback } from '../models/postback';
import { UserLinksModule } from '../api/user-links.module';

@Injectable({
  providedIn: 'root'
})
export class PostbackResolverService implements Resolve<Postback> {

  constructor(
    private _userLinksModule: UserLinksModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Postback> {
    let postback;

    if (!route.paramMap.get('linkType')) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    if (route.paramMap.get('linkType') !== 'postback') {
      return null;
    }

    let postbackId = parseInt(route.paramMap.get('linkId'));

    if (!postbackId) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    try {
      postback = await this._userLinksModule.getPostback(postbackId);
      if (!postback) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return postback;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}

