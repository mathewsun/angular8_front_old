import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ApiModule } from '../../../api/api.module';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AlertService } from '../../../services/gui/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  @ViewChild('loginInput', {static: false}) loginInputRef: ElementRef;
  @ViewChild('passwordInput', {static: false}) passwordInputRef: ElementRef;
  @ViewChild('passwordConfirmInput', {static: false}) passwordConfirmInputRef: ElementRef;

  public message: string = null;
  public processing: boolean = false;

  public signUpForm: FormGroup;

  public snapshot: ActivatedRouteSnapshot;

  public dSkypeValidator: ValidatorFn[] = [Validators.required];
  public dTelegramValidator: ValidatorFn[] = [Validators.required, Validators.pattern(/^((@[a-z]([a-z0-9_](?!_{2,})){4,30}[a-z0-9])|((\+[1-9]|8)[0-9]{3,15}))$/)];

  constructor(
    private _titleService: Title,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _apiModule: ApiModule,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService) {
    this.createForm();

    this.snapshot = _activatedRoute.snapshot;
    this._titleService.setTitle(this.snapshot.data.title);
  }

  private createForm(): void {
    this.signUpForm = this._formBuilder.group({
      mail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      messengerSelect: new FormControl('0', [Validators.required]),
      telegram: new FormControl('', this.dTelegramValidator),
      skype: new FormControl('', null),
      persistent: new FormControl('', [Validators.required]),
    });
  }

  get messengerSelect() {
    return this.signUpForm.get('messengerSelect');
  }

  get telegram() {
    return this.signUpForm.get('telegram');
  }

  get skype() {
    return this.signUpForm.get('skype');
  }

  onLogin() {
    let obj = this.signUpForm.getRawValue();

    this.signUpForm.markAllAsTouched();

    let mail: string = obj.mail;
    let password: string = obj.password;
    let passwordConfirm = obj.confirmPassword;
    let telegram: string = null;
    let skype: string = null;

    switch (this.messengerSelect.value) {
      case '0':
        telegram = obj.telegram;
        break;
      case '1':
        skype = obj.skype;
        break;
      default:
        this.message = `Fill all required fields`;
        return false;
    }

    if (password !== passwordConfirm) {
      this.message = `Password confirmation invalid`;
      return false;
    }

    if (!this.signUpForm.valid) {
      this.message = `Fill all required fields`;
      return false;
    }

    this.processing = true;

    this._apiModule.signUp({mail, password, telegram, skype})
      .then(async result => {

        if (result.success) {
          await this._router.navigate(['/confirm']);
          this.processing = false;
        } else {
          switch (result.errorCode) {
            case 8:
              this.message = `User with mail ${mail} already exists`;
              this.processing = false;
              break;
            case 12:
              this.message = `Wrong messenger account name`;
              this.processing = false;
              break;
            default:
              this.message = `Unknown error`;
              this.processing = false;
              break;
          }
        }
      })
      .catch(() => {
        this.processing = false;
        this.message = `Unknown error`;
      });

    return false;
  }

  onMessengerSelectSwitch(value: string | number = '0') {
    this.telegram.setValidators(null);
    this.skype.setValidators(null);

    this.telegram.markAsPristine();
    this.telegram.patchValue('');
    this.skype.markAsPristine();
    this.skype.patchValue('');

    switch (value) {
      case '0': this.telegram.setValidators(this.dTelegramValidator); break;
      case '1': this.skype.setValidators(this.dSkypeValidator); break;
      default:  this.telegram.setValidators(this.dTelegramValidator); break;
    }
  }

  onLogout() {
    //this.authService.logout();
  }

  ngOnInit() {
    this._alertService.clearAll();
  }

}
