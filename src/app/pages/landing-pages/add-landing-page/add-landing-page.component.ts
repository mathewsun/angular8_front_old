import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LandingPage, LandingPageType } from '../../../models/landingPage';
import { Title } from '@angular/platform-browser';
import { LandingPageModule } from '../../../api/landingPage.module';
import { AlertService } from '../../../services/gui/alert.service';
import { AlertTypeEnum } from '../../../models/enums/alertType.enum';

@Component({
  selector: 'app-add-landing-page',
  templateUrl: './add-landing-page.component.html',
  styleUrls: ['./add-landing-page.component.css']
})
export class AddLandingPageComponent implements OnInit {

  public snapshot: ActivatedRouteSnapshot;

  public processing: boolean = false;

  public landingPageForm: FormGroup;
  public landingTypeSelector = [
    {
      type: 'Mobile',
      selected: false
    },
    {
      type: 'Desktop',
      selected: false
    },
    {
      type: 'Adaptive',
      selected: true
    }
  ];
  public fileUploadType = 'desktopLanding';

  constructor(
    private _titleService: Title,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _landingPageModule: LandingPageModule,
    private _router: Router,
    private _alertService: AlertService
  ) {
    this.snapshot = activatedRoute.snapshot;

    this._titleService.setTitle(this.snapshot.data.title);
  }

  get name(): any {
    return this.landingPageForm.get('name');
  };

  get linkTemplate(): any {
    return this.landingPageForm.get('linkTemplate');
  };

  get observeLink(): any {
    return this.landingPageForm.get('observeLink');
  };

  get image(): any {
    return this.landingPageForm.get('image');
  };

  ngOnInit() {

    // *****************
    // Reactive offer form spawns here

    this.landingPageForm = this._formBuilder.group({
      'id': new FormControl(null),
      'name': new FormControl(null, Validators.required),
      'linkTemplate': new FormControl(null, [
        Validators.required,
        Validators.pattern('(https?:\\/\\/(?:www\\.?|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www?))[a-zA-Z0-9]+\\.[^\\s]{2,}|www?\\.[a-zA-Z0-9]+\\.[^\\s]{2,})')
      ]),
      'observeLink': new FormControl(null, [Validators.required, Validators.pattern('(https?:\\/\\/(?:www\\.?|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www?))[a-zA-Z0-9]+\\.[^\\s]{2,}|www?\\.[a-zA-Z0-9]+\\.[^\\s]{2,})')]),
      'image': new FormControl(null, Validators.required)
    });

    if (this.snapshot.data.edit) {
      let page: LandingPage = this.snapshot.data.landingPage;
      this.landingPageForm.patchValue(page);

    }

  }

  onSubmit() {

    this.processing = true;
    this.markFormGroupTouched(this.landingPageForm);
    if (this.landingPageForm.invalid) {
      this.processing = false;
      return;
    }

    let landingPage = this.landingPageForm.getRawValue();

    let landingType = 'Adaptive';
    this.landingTypeSelector.forEach((item) => {
      if (item.selected) {
        landingType = LandingPageType[item.type];
      }
    });

    landingPage.type = landingType;

    let model: { landingPage: LandingPage } = {landingPage: null};
    model.landingPage = landingPage;

    if (this.snapshot.data.edit) {
      this._landingPageModule.updateLandingPage(landingPage)
        .then(async () => {
          this._alertService.addAlert('Лендинг обновлен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
          await this._router.navigate(['dashboard/landing-pages']);
        })
        .catch((el) => {
          this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
          this.processing = false;
        });
    } else {
      this._landingPageModule.createLandingPage(model)
        .then(async () => {
          this._alertService.addAlert('Лендинг добавлен', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
          await this._router.navigate(['dashboard/landing-pages']);
        })
        .catch((el) => {
          this._alertService.addAlert('Ошибка: ' + el.statusText, AlertTypeEnum.Danger, null, 'far fa-times-circle', 3000);
          this.processing = false;
        });
    }

  }

  onTypeSelectorChange(id) {
    for (let i = 0; i < this.landingTypeSelector.length; i++) {
      if (this.landingTypeSelector[i].selected == true) {
        this.landingTypeSelector[i].selected = false;
      }
    }

    this.landingTypeSelector.forEach((item) => {
      if (item) {
        item.selected = false;
      }
    });

    this.landingTypeSelector[id].selected = true;
    this.fileUploadType = this.landingTypeSelector[id].type == 'Mobile' ? 'mobileLanding' : 'desktopLanding';
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

