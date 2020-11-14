import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router, UrlTree
} from '@angular/router';

import { Injectable } from '@angular/core';
import { ApiModule } from '../../api/api.module';


@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private apiModule: ApiModule, private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {

    const roles = await this.apiModule.getCurrentRoles();
    let roleAcquired: boolean = false;
    roles.forEach(role => {
      if (role.name == 'Superuser') {
        roleAcquired = true;
      }
    });
    if (roleAcquired) {
      return true;
    } else {
      await this.router.navigate(['/404']);
    }
  }
}
