import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router, UrlTree
} from '@angular/router';

import { Injectable } from '@angular/core';
import { ApiModule } from '../../api/api.module';


@Injectable()
export class FinanceGuard implements CanActivate {
  constructor(private _apiModule: ApiModule, private _router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {

    const roles = await this._apiModule.getCurrentRoles();
    let roleAcquired: boolean = false;
    roles.forEach(role => {
      if (role.name == 'Payments') {
        roleAcquired = true;
      }
    });
    if (roleAcquired) {
      return true;
    } else {
      await this._router.navigate(['/404']);
    }
  }
}
