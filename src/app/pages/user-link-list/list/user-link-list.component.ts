import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { Postback } from '../../../models/postback';
import { Traffback } from '../../../models/traffback';
import { UserLinksModule } from '../../../api/user-links.module';
import { User } from '../../../models/user';
import { WrapModelArrayPipe } from '../../../models/pipes/wrapModel.pipe';
import { UserLinkFilter } from '../../../models/filters/userLink.filter';
import { UserLinkListService } from '../../../services/transport/user-link-list.service';
import { UserLinkTypeEnum } from '../../../models/enums/UserLinkType.enum';
import { AlertTypeEnum } from '../../../models/enums/alertType.enum';
import { AlertService } from '../../../services/gui/alert.service';

@Component({
  selector: 'app-user-link-list',
  templateUrl: './user-link-list.component.html',
  styleUrls: ['./user-link-list.component.css'],
  providers: [UserLinkListService]
})

export class UserLinkListComponent implements OnInit, OnDestroy {

  public snapshot: ActivatedRouteSnapshot;

  public adminMode: boolean = false;

  public filtersFormGroup: FormGroup;

  public wrapModelArray: WrapModelArrayPipe = new WrapModelArrayPipe();
  public loading: boolean = false;

  // filter models

  public filterChanged: boolean = true;
  public linkList: Postback[] | Traffback[] = [];
  public userList: User[] = [];

  // paginator/filter variables

  public pageCount: number = 9;
  public pageSelected: number = 1;
  public itemsPerPage: number = 20;
  public filter: UserLinkFilter = {};
  public userLinkType: UserLinkTypeEnum = null;
  public UserLinkTypeEnum = UserLinkTypeEnum;

  // subscriptions

  public queryParamMapSubscription;
  public filtersFormSubscription;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _titleService: Title,
    private _userLinkModule: UserLinksModule,
    private _userLinkListService: UserLinkListService,
    private _router: Router,
    private _alertService: AlertService
  ) {
    this.snapshot = _activatedRoute.snapshot;
    this._titleService.setTitle(this.snapshot.data.title);
    this.adminMode = this.snapshot.data.adminMode;
    this.userLinkType = this.snapshot.data.userLinkType;
    this.userList = this.snapshot.data.userList || [];
    this.filtersFormGroup = new FormGroup({
        searchInput: new FormControl(null),
        webmasterMS: new FormControl(null)
      }
    );
  }

  ngOnInit() {

    // filling filter from query params
    this.updateFiltersFromQueryParams(this.snapshot.queryParamMap);

    // transforming user id list to user list
    let userListDefaultValue: User[] = null;
    if (this.adminMode) {
      if (this.filter.users) {
        userListDefaultValue = this.userListWrapper(this.filter.users);
      }
    }

    // patching values in filters form
    this.searchInput.patchValue(this.filter.search ? this.filter.search : null);

    this.webmasterMS.patchValue(userListDefaultValue ? this.wrapModelArray.transform(userListDefaultValue) : null);

    // subscriptions to params change
    this.queryParamMapSubscription = this._activatedRoute.queryParamMap.subscribe((answer) => {

      // updating page number from param query
      this.updatePageSelected(answer);

      this.loading = true;
      this.linkList = [];

      this._userLinkListService.getLinkList(this.userLinkType, this.filter, this.pageSelected, this.itemsPerPage).then(async res => {
        this.linkList = res.items;

        if (res.items.length == 0 && this.pageSelected !== 1) {
          this.addQueryParams(this.filter.search, this.filter.users, 1);
        } else {
          let pageCount = Math.ceil(res.itemsCount / this.itemsPerPage);

          if (pageCount == 0) {
            this.pageCount = 1;
          } else {
            this.pageCount = pageCount;
          }

          this.loading = false;
        }
      })
        .catch(() => {
          this.loading = false;
        });
    });

    // subscription to filters change
    this.filtersFormSubscription = this.filtersFormGroup.valueChanges.subscribe(() => {
      this.toggleFilters();
    });


  }

  ngOnDestroy() {
    this.filtersFormSubscription.unsubscribe();
    this.queryParamMapSubscription.unsubscribe();
  }


  get searchInput() {
    return this.filtersFormGroup.get('searchInput') as FormControl;
  }

  get webmasterMS() {
    return this.filtersFormGroup.get('webmasterMS') as FormControl;
  }

  public clearFilters() {
    this.resetFormGroup(this.filtersFormGroup);
    this.toggleFilters();
    this.filter = {};
  }

  public toggleFilters() {
    this.filterChanged = true;
  }

  updateFiltersInQueryParams() {

    if (!this.filterChanged) {
      return;
    }

    let filter: UserLinkFilter = {search: null, users: []};

    filter.search = this.searchInput.value;

    if (this.adminMode) {
      if (this.webmasterMS.value) {
        if (this.webmasterMS.value.length !== this.userList.length)
          this.webmasterMS.value.forEach(wC => filter.users.push(wC.value.id));
      }
    }

    this.addQueryParams(filter.search, filter.users, 1);

    this.filter = filter;

    this.filterChanged = false;

  }

  updatePageSelected(e) {
    this.pageSelected = parseInt(e.get('page')) || 1;
  }

  updateFiltersFromQueryParams(e) {
    let filter: any = {};

    if (e.get('users') == 'all' || e.get('users') == null) {
      filter.users = null;
    } else {
      filter.users = [parseInt(e.get('users'))];
    }
    filter.search = e.get('search') || null;
    this.filter = filter;
  }

  public deleteLink(linkId: number, listId: number) {
    if (confirm('Are you sure you want delete that link?')) {
      switch (this.userLinkType) {
        case UserLinkTypeEnum.UserPostback: {
          this._userLinkModule.deletePostback(linkId).then(() => {
            this.linkList.splice(listId, 1);
            this._alertService.addAlert('Ссылка удалена', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
          }).catch(err => {
              this._alertService.addAlert('Ошибка: ' + err.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
            }
          );
          break;
        }
        case UserLinkTypeEnum.UserTraffback: {
          this._userLinkModule.deleteTraffback(linkId).then(() => {
            this.linkList.splice(listId, 1);
            this._alertService.addAlert('Ссылка удалена', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
          }).catch(err => {
              this._alertService.addAlert('Ошибка: ' + err.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
            }
          );
          break;
        }
        case UserLinkTypeEnum.AdminPostback: {
          this._userLinkModule.adminDeletePostback(linkId).then(() => {
            this.linkList.splice(listId, 1);
            this._alertService.addAlert('Ссылка удалена', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
          }).catch(err => {
              this._alertService.addAlert('Ошибка: ' + err.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
            }
          );
          break;
        }
        case UserLinkTypeEnum.AdminTraffback: {
          this._userLinkModule.adminDeleteTraffback(linkId).then(() => {
            this.linkList.splice(listId, 1);
            this._alertService.addAlert('Ссылка удалена', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
          }).catch(err => {
              this._alertService.addAlert('Ошибка: ' + err.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
            }
          );
          break;
        }
        default: {
          this._alertService.addAlert('Неизвестная ошибка', AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        }
      }
    }
  }


  public resetFormGroup(formGroup: FormGroup) {
    (<any> Object).values(formGroup.controls).forEach(control => {
      control.reset();

      if (control.controls) {
        this.resetFormGroup(control);
      }

    });
  }

  userListWrapper(userIds: number[] = []) {
    let userList: User[] = [];
    let allUsers: User[] = this.userList;

    userIds.map(id => {
      userList.push(allUsers[id - 1]);
    });

    return userList;
  }

  public addQueryParams(search: string = null, webmasters: number[] = null, page: number = 1) {

    let queryParams: any = {};

    if (search) {
      queryParams.search = search;
    }

    if (webmasters) {
      if (webmasters.length > 0) {
        queryParams.users = webmasters.join(',');
      }
    }

    queryParams.page = page;

    this._router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: '',
    });
  }
}
