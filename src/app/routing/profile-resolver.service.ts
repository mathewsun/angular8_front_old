import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserModule } from '../api/user.module';
import { User } from '../models/user';

@Injectable()
export class ProfileResolverService implements Resolve<User> {

  constructor(
    private _userModule: UserModule,
    private _router: Router) {

  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<User> {
    let userId = parseInt(route.paramMap.get('userId'));

    if (!userId) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    let profile;

    try {
      profile = await this._userModule.getProfile(userId);
      if (!profile) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return profile;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
