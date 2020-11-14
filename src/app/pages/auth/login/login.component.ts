import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import {ApiModule} from "../../../api/api.module";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DictionaryModule} from "../../../api/dictionary.module";
import { Title } from '@angular/platform-browser';
import { AlertService } from '../../../services/gui/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public message: string = null;

  public processing: boolean = false;

  public loginForm: FormGroup;

  public snapshot: ActivatedRouteSnapshot;

  constructor(
    private _titleService: Title,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _apiModule: ApiModule,
    private _formBuilder: FormBuilder,
    private _dictionaryModule: DictionaryModule,
    private _alertService: AlertService) {
    this.createForm();

    this.snapshot = _activatedRoute.snapshot;

    this._titleService.setTitle(this.snapshot.data.title);
  }

  private createForm(): void {
    this.loginForm = this._formBuilder.group({
      mail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      persistent: new FormControl(true),
    });
  }


  onLogin() {
    let obj = this.loginForm.getRawValue();
    this.processing = true;

    this._apiModule.signIn(obj)
      .then(async result => {
        if (result.success) {
          await this._dictionaryModule.update();
          await this._router.navigate(['/dashboard']);
          this.processing = false;
        } else {
          this.message = result.message;
          this.processing = false;
        }
      })
      .catch(err => {
        this.processing = false;
        console.log(err);
      });

    return false;
  }

  onLogout() {
    this._apiModule.logout();
  }

  ngOnInit() {
    this._alertService.clearAll();
  }

}
