 import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router, UrlTree
} from '@angular/router';

import {Injectable} from '@angular/core';
import {ApiModule} from '../../api/api.module';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private apiModule: ApiModule, private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {

    const roles = await this.apiModule.getCurrentRoles();

    if (!roles) {
      await this.router.navigate(['/sign-in']);
    }

    return !!roles;
  }


}
