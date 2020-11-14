import { Injectable } from '@angular/core';
import { Alert } from '../../models/alert';
import { AlertTypeEnum } from '../../models/enums/alertType.enum';

@Injectable({providedIn: 'root'})
export class AlertService {

  private alertQueue: Alert[] = [];
  private lastId: number = 0;

  constructor() {

  }

  public clearAll() {
    this.alertQueue.splice(0, this.alertQueue.length);
  }

  public deleteAlert(id: number) {
    for (var i = 0; i < this.alertQueue.length; i++) {
      if (this.alertQueue[i].id == id) {
        this.alertQueue.splice(i, 1);
        return;
      }
    }
  }

  public getList() {
    return this.alertQueue;
  }

  public addAlert(message: string = '', type: AlertTypeEnum = AlertTypeEnum.Primary, badge: string = null, icon: string = null, timer: number = null){
    let alert: Alert = {
      id: this.lastId + 1,
      message: message,
      type: type,
      badge: badge,
      icon:  icon,
      timer: timer,
    };

    if (alert.timer) {
      setTimeout(()=>{this.deleteAlert(alert.id)}, alert.timer);
    }

    this.alertQueue.push(alert);
    this.lastId++;
  }

}
