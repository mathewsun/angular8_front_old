import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserModule } from '../api/user.module';

@Injectable()
export class RequisitesResolverService implements Resolve<{[key: string]: string}> {

  constructor(
    private _userModule: UserModule,
    private _router: Router) {

  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<{[key: string]: string}> {

    let userId = this._userModule.currentUser.id;

    if (!userId) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    let requisites;

    try {
      requisites = await this._userModule.getPaymentInfo(userId);
      if (!requisites) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }

      return requisites;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
