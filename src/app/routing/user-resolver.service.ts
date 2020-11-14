import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserModule } from '../api/user.module';
import { User } from '../models/user';

@Injectable()
export class UserResolver implements Resolve<User> {

  constructor(
    private  _userModule: UserModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<User> {
    let mail = route.paramMap.get('mail');

    if (!mail) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    let fullUser;
    try {
      fullUser = await this._userModule.getFullUser(mail);
      if (!fullUser) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return fullUser;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
