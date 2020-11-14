import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserLinksModule } from '../api/user-links.module';
import { UserModule } from '../api/user.module';

@Injectable({
  providedIn: 'root'
})
export class AdminEditProfileResolverService implements Resolve<any> {

  constructor(
    private _userLinksModule: UserLinksModule,
    private _userModule: UserModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    let mail = route.paramMap.get('mail');

    if (!mail) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    let body: any = {};
    try {
      body.user = await this._userModule.getFullUser(mail);
      if (body.user) {
        let postbackList = await this._userLinksModule.adminPostbackList(null);
        body.postbackList = postbackList.items;
        if (body.postbackList) {
          return body;
        }
      }
      await this._router.navigate(['/dashboard/404']);
      return null;
    } catch (err) {
      await this._router.navigate(['/dashboard/404']);
      return null;
    }
  }
}

