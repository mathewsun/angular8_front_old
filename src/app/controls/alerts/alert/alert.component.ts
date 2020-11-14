import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Alert } from '../../../models/alert';
import { AlertService } from '../../../services/gui/alert.service';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() model: Alert;

  CSSClassTypeList = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ];

  constructor(private _alertService: AlertService) { }

  ngOnInit() {

  }

  onDestroy() {
    this._alertService.deleteAlert(this.model.id);
  }

}
