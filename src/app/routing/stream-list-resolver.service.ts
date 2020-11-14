import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Stream } from '../models/stream';
import { Injectable } from '@angular/core';
import { StreamModule } from '../api/stream.module';

@Injectable({
  providedIn: 'root'
})
export class StreamListResolverService implements Resolve<Stream[]> {

  constructor(
    private _streamModule: StreamModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Stream[]> {
    let listStreams;

    try {
      listStreams = await this._streamModule.listStreams(null);
      if (!listStreams) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return listStreams.items;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
