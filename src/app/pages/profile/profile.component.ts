import { Component, OnInit, ViewChild } from '@angular/core';
import { User, UserProfile } from '../../models/user';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../../models/contact';
import { UserModule } from '../../api/user.module';
import { Role } from '../../models/role';
import { DictionaryModule } from '../../api/dictionary.module';
import { ProgressButtonComponent } from '../../controls/progress-button/progress-button.component';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Postback } from '../../models/postback';
import { AlertService } from '../../services/gui/alert.service';
import { AlertTypeEnum } from '../../models/enums/alertType.enum';
import { TimeZoneService } from '../../services/transport/time-zone.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [TimeZoneService]
})
export class ProfileComponent implements OnInit {

  public _routeSnapshot: ActivatedRouteSnapshot;

  public profileForm: FormGroup;
  public changePassForm: FormGroup;
  public user: User = null;
  public processing: boolean = false;

  public rolesFormGroup: FormGroup;
  public postbackList: Postback[] = [];

  public roles: Role[] = [];

  public percentFormGroup: FormGroup;

  public timezoneList: any[] = [];
  public guessedTimeZone: string = '';

  /**
   *
   * @param _route
   * @param _router
   * @param _userModule
   * @param _dictionaryModule
   * @param _titleService
   * @param _alertService
   * @param _timeZoneService
   */
  constructor(
    private _titleService: Title,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userModule: UserModule,
    private _dictionaryModule: DictionaryModule,
    private _alertService: AlertService,
    private _timeZoneService: TimeZoneService) {
    this._routeSnapshot = _route.snapshot;

    if (this._routeSnapshot.data.title) {
      this._titleService.setTitle(this._routeSnapshot.data.title);
    } else {
      this._titleService.setTitle(this._routeSnapshot.data.adminProfileEditObj.user.mail + ' - C2M');
    }

    if (this._routeSnapshot.data.mode == 'admin') {
      this.postbackList = this._routeSnapshot.data.adminProfileEditObj.postbackList || [];
    } else {
      this.postbackList = this._routeSnapshot.data.postbackList || [];
    }

    this.postbackList.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      } else {
        return -1;
      }
    });

    this.profileForm = new FormGroup({
      'id': new FormControl(),
      'userId': new FormControl('', Validators.required),
      'firstName': new FormControl('', Validators.maxLength(50)),
      'lastName': new FormControl('', Validators.maxLength(50)),
      'picture': new FormControl(''),
      'mobile': new FormControl('', Validators.maxLength(64)),
      'postbackLinkId': new FormControl(null),
      'timeZone': new FormControl(null),
      'contactsSubForm': new FormGroup({
        'skype': new FormGroup({'name': new FormControl('skype'), 'value': new FormControl('', Validators.maxLength(64))}),
        'telegram': new FormGroup({'name': new FormControl('telegram'), 'value': new FormControl('', Validators.maxLength(64))}),
        'vkontakte': new FormGroup({'name': new FormControl('vkontakte'), 'value': new FormControl('', Validators.maxLength(64))}),
        'facebook': new FormGroup({'name': new FormControl('facebook'), 'value': new FormControl('', Validators.maxLength(64))}),
        'searchengines': new FormGroup({'name': new FormControl('searchengines'), 'value': new FormControl('', Validators.maxLength(64))})
      })
    });

    if (this._routeSnapshot.data.mode !== 'admin') {
      this.changePassForm = new FormGroup({
        'currentPassword': new FormControl(null, Validators.required),
        'newPassword': new FormControl(null, [Validators.required, Validators.minLength(6)]),
        'repeatNewPassword': new FormControl(null, [Validators.required, Validators.minLength(6)])
      });
    } else {
      this.changePassForm = new FormGroup({
        'currentPassword': new FormControl(null),
        'newPassword': new FormControl(null, [Validators.required, Validators.minLength(6)]),
        'repeatNewPassword': new FormControl(null, [Validators.required, Validators.minLength(6)])
      });
    }

    this.rolesFormGroup = new FormGroup({
      'roles': new FormArray([])
    });

    this.roles = this._dictionaryModule.roles;
    this._dictionaryModule.rolesUpdated.subscribe(newRoles => {
      this.roles = newRoles;
    });

    this.percentFormGroup = new FormGroup({
      'percentInput': new FormControl(null, [Validators.max(100), Validators.min(0), Validators.required])
    });

  }


  ngOnInit() {

    this.timezoneList = this._timeZoneService.getTimeZonesList();

    if (this._routeSnapshot.data.mode == 'admin') {
      this.handleUser(this._routeSnapshot.data.adminProfileEditObj.user);
      this._userModule.userChanged.subscribe(user => {
        this.handleUser(user);
      });
    }

    if (this._routeSnapshot.data.self) {
      this.handleUser(this._userModule.currentUser);
      this._userModule.userChanged.subscribe(user => {
        this.handleUser(user);
      });
    }

  }

  /**
   *
   * @param user
   */
  private handleUser(user: User) {
    if (!user) {
      return;
    }
    this.user = user;
    let profile: UserProfile = user.profile;

    this.profileForm.patchValue(profile);

    // setting guessed tz as default

    if (this.profileForm.get('timeZone').value == null) {
      this.profileForm.get('timeZone').patchValue(this.guessedTimeZone);
    }

    let contactsSubForm = this.profileForm.get('contactsSubForm');
    profile.contacts.forEach(c => {
      if (c.name == 'mobile') {
        this.profileForm.get('mobile').patchValue(c.value);
      } else {
        contactsSubForm.get(c.name).patchValue(c);
      }
    });

    this.percentInput.patchValue(this.user.percent);

    setTimeout(() => {
      this.rolesFormGroup.setControl('roles', new FormArray([]));
      user.roles.forEach(role => {
        (<FormArray> this.rolesFormGroup.get('roles').value).push(ProfileComponent.createRoleForm(role));
      });
    }, 0);

    this.profileForm.get('picture').markAsUntouched();
  }

  /**
   *
   * @param roles
   */
  public orderById(roles: Role[]): Role[] {
    return roles.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  /**
   *
   * @param roles
   * @param userRoles
   */
  public filterRoles(roles: Role[], userRoles: Role[]): Role[] {
    return roles
      .filter(r => {
        return !userRoles.find(ur => ur.id == r.id);
      })
      .sort((a, b) => {
        if (a.id > b.id) {
          return 1;
        }
      });
  }

  /**
   *
   */
  public async saveChanges() {

    let profile = this.profileForm.getRawValue();
    let contacts: Contact[] = [];

    this.processing = true;

    if (!this.profileForm.valid) {
      this._alertService.addAlert('Введите верные данные', AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
      this.processing = false;
      return;
    }

    contacts.push({id: 0, name: 'mobile', value: profile.mobile});

    for (let key in profile.contactsSubForm) {
      if (profile.contactsSubForm.hasOwnProperty(key)) {
        contacts.push({id: 0, name: key, value: profile.contactsSubForm[key].value});
      }
    }

    profile.contacts = contacts;
    delete (profile.contactsSubForm);
    delete (profile.mobile);

    let imageFile = null;

    if (profile.picture.touched) {
      imageFile = profile.picture;
    }

    await this._userModule.updateProfile(profile, imageFile)
      .then(() => {
        this._alertService.addAlert('Профиль сохранен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        this.processing = false;
      })
      .catch(el => {
        this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        this.processing = false;
      });
  }

  /**
   *
   * @param index
   * @param item
   */
  contactsTrackFn(index: any, item: any): string {
    return index;
  }

  /**
   *
   * @param role
   */
  public addRole(role: Role) {
    this.user.roles.push(role);
  }

  /**
   *
   * @param role
   */
  public removeRole(role: Role) {
    let index = this.user.roles.findIndex(r => r.id == role.id);
    this.user.roles.splice(index, 1);
  }

  /**
   *
   * @param role
   */
  private static createRoleForm(role: any = {}): FormGroup {
    let group = new FormGroup({
      'id': new FormControl(),
      'name': new FormControl()
    });

    group.patchValue(role);
    return group;
  }

  /**
   *
   */
  @ViewChild('activateButton', {
    static: false,
    read: ProgressButtonComponent
  }) activateButton: ProgressButtonComponent;

  public activate() {
    this.activateButton.processing = true;

    this._userModule.activate(this.user.id)
      .then(() => {
        this._alertService.addAlert('Пользователь активирован', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        this.activateButton.processing = false;
      })
      .catch(el => {
        this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        this.activateButton.processing = false;
      });
  }

  public deactivate() {
    this.activateButton.processing = true;

    this._userModule.deactivate(this.user.id)
      .then(() => {
        this._alertService.addAlert('Пользователь деактивирован', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        this.activateButton.processing = false;
      })
      .catch(el => {
        this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        this.activateButton.processing = false;
      });
  }

  /**
   *
   */
  @ViewChild('passwordButton', {
    static: false,
    read: ProgressButtonComponent
  }) passwordButton: ProgressButtonComponent;

  changePassword() {

    this.changePassForm.markAllAsTouched();
    this.passwordButton.processing = true;

    let changePassData = this.changePassForm.getRawValue();

    if (this._routeSnapshot.data.mode !== 'admin') {
      if (!changePassData.currentPassword) {
        this._alertService.addAlert('Введите текущий пароль', AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        this.passwordButton.processing = false;
        return;
      }
    }

    if ((!changePassData.repeatNewPassword) || (!changePassData.newPassword)) {
      this._alertService.addAlert('Введите новый пароль', AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
      this.passwordButton.processing = false;
      return;
    }

    if (changePassData.repeatNewPassword !== changePassData.newPassword) {
      this._alertService.addAlert('Пароли не совпадают', AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
      this.passwordButton.processing = false;
      return;
    }

    if (this.changePassForm.invalid) {
      this._alertService.addAlert('Введите верные данные', AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
      this.passwordButton.processing = false;
      return;
    }

    this._userModule.changePassword(this.user.mail, changePassData.currentPassword, changePassData.newPassword)
      .then(() => {
        this._alertService.addAlert('Пароль сохранен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        this.passwordButton.processing = false;
      })
      .catch(el => {
        if (el.statusText == 'Unauthorized') {
          el.statusText = 'неверный пароль';
        }
        this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        this.passwordButton.processing = false;
      });
  }

  @ViewChild('confirmButton', {
    static: false,
    read: ProgressButtonComponent
  }) confirmButton: ProgressButtonComponent;

  public confirm() {
    this.confirmButton.processing = true;

    this._userModule.confirm(this.user.id)
      .then(() => {
        this._alertService.addAlert('Регистрация подтверждена', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        this.confirmButton.processing = false;
      })
      .catch(el => {
        this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        this.confirmButton.processing = false;
      });
  }

  /**
   *
   */
  @ViewChild('applyRolesButton', {
    static: false,
    read: ProgressButtonComponent
  }) applyRolesButton: ProgressButtonComponent;

  public applyRoles() {
    this.applyRolesButton.processing = true;

    this._userModule.updateRoles(this.user)
      .then(() => {
        this._alertService.addAlert('Роли изменены', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
        this.applyRolesButton.processing = false;
      })
      .catch(el => {
        this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
        this.applyRolesButton.processing = false;
      });
  }

  @ViewChild('applyPercentButton', {
    static: false,
    read: ProgressButtonComponent
  }) applyPercentButton: ProgressButtonComponent;

  public applyPercent() {
    this.applyPercentButton.processing = true;

    if (this.percentInput.valid) {
      this._userModule.updatePercent(this.user.id, this.percentInput.value)
        .then(() => {
          this._alertService.addAlert('Процент обновлён', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
          this.applyPercentButton.processing = false;
        })
        .catch(el => {
          this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
          this.applyPercentButton.processing = false;
        });
    } else {
      this.percentInput.markAsTouched();
      this.applyPercentButton.processing = false;
    }
  }

  get currentPassword() {
    return this.changePassForm.get('currentPassword');
  };

  get newPassword() {
    return this.changePassForm.get('newPassword');
  };

  get repeatNewPassword() {
    return this.changePassForm.get('repeatNewPassword');
  };

  get firstName() {
    return this.profileForm.get('firstName');
  };

  get lastName() {
    return this.profileForm.get('lastName');
  };

  get mobile() {
    return this.profileForm.get('mobile');
  };

  get percentInput() {
    return this.percentFormGroup.get('percentInput');
  }

}
