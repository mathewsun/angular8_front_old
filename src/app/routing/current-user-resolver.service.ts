import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserModule } from '../api/user.module';

@Injectable()
export class CurrentUserResolver implements Resolve<void> {

  constructor(
    private _userModule: UserModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {
    let updateUser;

    try {
      updateUser = await this._userModule.updateUser();
      if (!updateUser) {
        //await this._router.navigate(['/dashboard/404']);
        return null;
      }
      return updateUser;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
