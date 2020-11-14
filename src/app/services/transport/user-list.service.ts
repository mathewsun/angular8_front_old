import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFilter } from '../../models/filters/user.filter';
import { UserModule } from '../../api/user.module';
import { Page } from '../../models/page';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: []
})

export class UserListService implements OnInit {

  constructor(private _userModule: UserModule) {
  }

  ngOnInit() {

  }

  public async getUserList(filter: UserFilter = null, pageNumber: number, itemsPerPage = 10): Promise<Page> {
    let payload;

    payload = filter;
    payload.pageNumber = pageNumber - 1;
    payload.itemsPerPage = itemsPerPage;

    return await this._userModule.getUserList(payload);
  }
}
