import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user';
import { UserModule } from '../api/user.module';

@Injectable({
  providedIn: 'root'
})
export class UserListResolverService implements Resolve<User[]> {

  constructor(
    private _userModule: UserModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<User[]> {
    let list;

    try {
      list = await this._userModule.getUserList(null);
      if (!list) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return list.items;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
