import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../../models/page';
import { UserLinksModule } from '../../api/user-links.module';
import { UserLinkTypeEnum } from '../../models/enums/UserLinkType.enum';
import { UserLinkFilter } from '../../models/filters/userLink.filter';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: []
})

export class UserLinkListService implements OnInit {

  constructor(private _userLinksModule: UserLinksModule) {
  }

  ngOnInit() {

  }

  public async getLinkList(type: UserLinkTypeEnum, filter: UserLinkFilter = null, pageNumber: number = 1, itemsPerPage: number = 10): Promise<Page> {
    let payload = filter;

    payload.itemsPerPage = itemsPerPage;
    payload.pageNumber = pageNumber - 1;

    let userList: Page;

    switch (type) {
      case UserLinkTypeEnum.UserPostback:
        userList = await this._userLinksModule.postbackList(payload);
        return userList;
      case UserLinkTypeEnum.UserTraffback:
        userList = await this._userLinksModule.traffbackList(payload);
        return userList;
      case UserLinkTypeEnum.AdminPostback:
        userList = await this._userLinksModule.adminPostbackList(payload);
        return userList;
      case UserLinkTypeEnum.AdminTraffback:
        userList = await this._userLinksModule.adminTraffbackList(payload);
        return userList;
      default: return null;
    }
  }
}
