import { Component, OnInit } from '@angular/core';
import { Alert } from '../../../models/alert';
import { AlertService } from '../../../services/gui/alert.service';

@Component({
  selector: 'alert-queue',
  templateUrl: './alert-queue.component.html',
  styleUrls: ['./alert-queue.component.css']
})
export class AlertQueueComponent implements OnInit {
  alertList: Alert[] = [];

  constructor(private _alertService: AlertService) {
    this.updateList();
  }

  ngOnInit() {
  }

  private updateList() {
    this.alertList = this._alertService.getList();
  }

}
