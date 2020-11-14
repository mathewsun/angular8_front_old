import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageModule } from '../../api/landingPage.module';
import { LandingPageFilter } from '../../models/filters/landingPage.filter';
import { Page } from '../../models/page';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: []
})

export class LandingPageListService implements OnInit {

  constructor(private _landingPageModule: LandingPageModule) {
  }

  ngOnInit() {

  }

  public async getLandingPageList(filter: LandingPageFilter = null, pageNumber: number, itemsPerPage = 10): Promise<Page> {
    let payload;

    payload = filter;
    payload.pageNumber = pageNumber - 1;
    payload.itemsPerPage = itemsPerPage;

    let result;

    result = await this._landingPageModule.getLandingPages(payload);
    result.items.forEach(lp => {
        lp.imageLink = `http://${ENVIRONMENT.API_HOST}/image/${lp.image}`;
      });
    return result;
  }
}
