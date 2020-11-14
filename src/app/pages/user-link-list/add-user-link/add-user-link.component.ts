import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserLinksModule } from '../../../api/user-links.module';
import { Location } from '@angular/common';
import { AlertService } from '../../../services/gui/alert.service';
import { AlertTypeEnum } from '../../../models/enums/alertType.enum';
import { ModelWrapper } from '../../../models/modelWrapper';

@Component({
  selector: 'app-add-user-link',
  templateUrl: './add-user-link.component.html',
  styleUrls: ['./add-user-link.component.css']
})
export class AddUserLinkComponent implements OnInit {

  public snapshot: ActivatedRouteSnapshot;
  public adminMode: boolean = false;

  public processing: boolean = false;

  public linkForm: FormGroup;

  // right now we got only 3 types, later there will be more depends on offer type
  public actionList: any[] = [{field: 'onHold', label: 'Hold'}, {field: 'onApproved', label: 'Approved'}, {
    field: 'onRejected',
    label: 'Rejected'
  }];

  // false for traffic back, true for postback
  public linkType: boolean = false;

  params: any[];

  constructor(
    private _titleService: Title,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _userLinkModule: UserLinksModule,
    private _location: Location,
    private _alertService: AlertService,
  ) {
    this.snapshot = _activatedRoute.snapshot;
    this._titleService.setTitle(this.snapshot.data.title);
    this.linkType = this.snapshot.paramMap.get('linkType') == 'postback';
    this.adminMode = this.snapshot.data.adminMode;

    this.params = [
      {
        param: 'stream_id',
        desc: 'ID потока'
      },
      {
        param: 'offer_id',
        desc: 'ID оффера'
      },
      {
        param: 'offer_name',
        desc: 'Название оффера'
      },
      {
        param: 'action_type',
        desc: 'Статус конверсии: Payout, hold, reject'
      },
      {
        param: 'cid',
        desc: 'ID клика'
      },
      {
        param: 'lead_id',
        desc: 'ID лида рекламодателя'
      },
      {
        param: 'payout',
        desc: 'стоимость конверсии для партнёра (разделитель - точка)'
      },
      {
        param: 'currency',
        desc: 'Валюта оффера (ISO): RUB, USD и т.д.'
      },
      {
        param: 'date',
        desc: 'Дата события конверсии в формате ISO-8601 (Пример: 2017-06-26T20:45:00.070Z)'
      },
      {
        param: 'subid1',
        desc: 'subid 1'
      },
      {
        param: 'subid2',
        desc: 'subid 2'
      },
      {
        param: 'subid3',
        desc: 'subid 3'
      },
      {
        param: 'subid4',
        desc: 'subid 4'
      },
      {
        param: 'subid5',
        desc: 'subid 5'
      },
    ];
  }

  get id(): any {
    return this.linkForm.get('id');
  };

  get name(): any {
    return this.linkForm.get('name');
  };

  get link(): any {
    return this.linkForm.get('link');
  };

  // get type(): any {
  //   return this.linkForm.get('type');
  // };

  get actions(): any {
    return this.linkForm.get('actions');
  };

  ngOnInit() {

    // Reactive offer form

    this.linkForm = this._formBuilder.group({
      'id': new FormControl(null),
      'name': new FormControl(null, Validators.required),
      // 'type': new FormControl(0, Validators.required),
      // 'method': new FormControl(null),
      'link': new FormControl(null, [
        Validators.required,
        Validators.pattern('(https?:\\/\\/(?:www\\.?|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www?))[a-zA-Z0-9]+\\.[^\\s]{2,}|www?\\.[a-zA-Z0-9]+\\.[^\\s]{2,})'),
      ]),
    });

    if (this.linkType) {
      this.linkForm.addControl('actions', new FormControl(null, Validators.required));
    }

    // if we are on edit page, preload data from link

    if (this.snapshot.data.edit) {
      let link: {} = {};
      switch (this.snapshot.paramMap.get('linkType')) {
        case 'traffback': {
          link = this.snapshot.data.traffBackLink;
          break;
        }
        case 'postback': {
          link = this.snapshot.data.postbackLink;

          let actions = [];

          for (let i = 0; i < this.actionList.length; i++) {
            if (this.snapshot.data.postbackLink[this.actionList[i].field]) {
              actions.push(this.actionList[i]);
            }
          }

          this.actions.patchValue(ModelWrapper.wrapArray(actions));

          break;
        }
      }
      this.linkForm.patchValue(link);
    }
  }

  onSubmit() {

    this.processing = true;
    this.markFormGroupTouched(this.linkForm);
    if (this.linkForm.invalid) {
      this.processing = false;
      return;
    }

    let link = this.linkForm.getRawValue();
    delete link.actions;

    if (this.linkType) {
      link.onHold = false;
      link.onApproved = false;
      link.onRejected = false;

      this.actions.value.forEach(el => {
        link[el.value.field] = el.selected;
      });
    }

    if (this.snapshot.data.edit) {
      if (this.linkType) { // postback
        if (this.adminMode) {
          this._userLinkModule.adminUpdatePostback(link).then(async () => {
            this._alertService.addAlert('Постбек обновлен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
            this._location.back();
          })
            .catch((el) => {
              this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
            });
        } else {
          this._userLinkModule.updatePostback(link).then(async () => {
            this._alertService.addAlert('Постбек обновлен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
            this._location.back();
          })
            .catch((el) => {
              this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
            });
        }
      } else { // traffback
        if (this.adminMode) {
          this._userLinkModule.adminUpdateTraffback(link).then(async () => {
            this._alertService.addAlert('Траффбек обновлен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
            this._location.back();
          })
            .catch((el) => {
              this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
            });
        } else {
          this._userLinkModule.updateTraffback(link).then(async () => {
            this._alertService.addAlert('Траффбек обновлен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
            this._location.back();
          })
            .catch((el) => {
              this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
            });
        }
      }
    } else {
      if (this.linkType) { // postback
        this._userLinkModule.createPostback(link).then(async () => {
          this._alertService.addAlert('Постбек добавлен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
          this._location.back();
        })
          .catch((el) => {
            this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
          });
      } else { // traffback
        this._userLinkModule.createTraffback(link).then(async () => {
          this._alertService.addAlert('Постбек добавлен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
          this._location.back();
        })
          .catch((el) => {
            this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
          });
      }
    }

  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any> Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

