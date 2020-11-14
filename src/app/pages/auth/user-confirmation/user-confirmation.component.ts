import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {ApiModule} from "../../../api/api.module";
import {Title} from '@angular/platform-browser';
import {AlertService} from '../../../services/gui/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './user-confirmation.component.html',
  styleUrls: ['./user-confirmation.component.css']
})
export class UserConfirmationComponent implements OnInit {

  public token: string;
  public message: string;
  public validationStateMessage: string = 'Validation...';

  public snapshot: ActivatedRouteSnapshot;

  constructor(
    private _titleService: Title,
    private _router: Router,
    private _apiModule: ApiModule,
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService) {
    this.snapshot = _activatedRoute.snapshot;

    this._titleService.setTitle(this.snapshot.data.title);
  }

  ngOnInit() {
    this._alertService.clearAll();
    this._activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log(this.token);
      if (this.token) {
        this._apiModule.confirm(this.token).then(async result => {
          if (result.success) {
            this.validationStateMessage = 'Confirmed!';
          } else {
            this.validationStateMessage = result.message;
          }
        });
      } else {
        this.validationStateMessage = 'No confirmation token provided';
      }
    });
  }

}
