import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { LandingPage } from '../models/landingPage';
import { LandingPageModule } from '../api/landingPage.module';

@Injectable({
  providedIn: 'root'
})
export class LandingPageResolverService implements Resolve<LandingPage> {

  constructor(
    private _landingPageModule: LandingPageModule,
    private _router: Router) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<LandingPage> {
    let landingPageId = parseInt(route.paramMap.get('id'));

    if (!landingPageId) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }

    let landingPage;
    try {
      landingPage = await this._landingPageModule.getLandingPage(landingPageId);
      if (!landingPage) {
        await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
        return null;
      }
      return landingPage;
    } catch (err) {
      await this._router.navigate(['/dashboard/404'], {skipLocationChange: true});
      return null;
    }
  }
}
