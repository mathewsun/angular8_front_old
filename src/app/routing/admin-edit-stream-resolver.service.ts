import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserLinksModule } from '../api/user-links.module';
import { StreamModule } from '../api/stream.module';

@Injectable({
  providedIn: 'root'
})
export class AdminEditStreamResolverService implements Resolve<any> {

  constructor(
    private _userLinksModule: UserLinksModule,
    private _streamModule: StreamModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    let streamId = route.paramMap.get('streamId');

    if (!streamId) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    let body: any = {};
    try {
      body.stream = await this._streamModule.getStream(parseInt(streamId));
      if (body.stream) {
        let postbackList = await this._userLinksModule.adminPostbackList(null);
        body.postbackList = postbackList.items;
        let traffbackList = await this._userLinksModule.adminTraffbackList(null);
        body.traffbackList = traffbackList.items;
        if (body.postbackList && body.traffbackList) {
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

