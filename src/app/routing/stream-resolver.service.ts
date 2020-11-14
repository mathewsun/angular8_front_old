import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Stream } from '../models/stream';
import { Injectable } from '@angular/core';
import { StreamModule } from '../api/stream.module';

@Injectable({
  providedIn: 'root'
})
export class StreamResolverService implements Resolve<Stream> {

  constructor(
    private _streamModule: StreamModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Stream> {
    let streamId = parseInt(route.paramMap.get('streamId'));

    if (!streamId) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    let stream;
    try {
      stream = await this._streamModule.getStream(streamId);
      if (!stream) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
    return stream;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
