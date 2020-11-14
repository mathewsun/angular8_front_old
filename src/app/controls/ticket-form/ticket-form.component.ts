import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiModule} from '../../api/api.module';
import {User} from '../../models/user';
import {TicketTypeEnum} from '../../models/enums/ticketType.enum';
import {UserModule} from '../../api/user.module';
import { AlertService } from '../../services/gui/alert.service';
import { AlertTypeEnum } from '../../models/enums/alertType.enum';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.css']
})

export class TicketFormComponent implements OnInit, OnChanges {

  @Input('back') public back: boolean = false;
  @Input('close') public close: boolean = false;
  @Input('format') public format: 'popup' | 'page' = 'page';
  @Input('type') public type: 'general' | 'requestAccess' = 'general';
  @Input('offerId') public offerId: number = null;
  @Input('offerName') public offerName: string = '';

  @Output() onSend = new EventEmitter();

  public snapshot: ActivatedRouteSnapshot;
  public newTicket: FormGroup;
  public processing: boolean = false;
  public user: User = null;

  public sent: boolean = false;

  public ticketTypeEnum = TicketTypeEnum;

  public header: string = 'Contact us';

  constructor(
    private _apiModule: ApiModule,
    private _userModule: UserModule,
    private _alertService: AlertService
  ) {

    this.newTicket = new FormGroup({
      'ticketType': new FormControl(null, Validators.required),
      'subject': new FormControl(null, [Validators.maxLength(64), Validators.required]),
      'message': new FormControl(null, Validators.required),
    });

    this.user = this._userModule.currentUser;
    this._userModule.userChanged.subscribe(user => {
      this.user = user;
    });
  }

  get ticketType() {
    return this.newTicket.get('ticketType');
  }

  get subject() {
    return this.newTicket.get('subject');
  }

  get message() {
    return this.newTicket.get('message');
  }

  ngOnInit() {
  }

  public onSubmit() {

    this.processing = true;
    this.markFormGroupTouched(this.newTicket);

    if (this.newTicket.invalid) {
      this.processing = false;
      return;
    }

    let ticketType: TicketTypeEnum = this.ticketType.value;
    let subject = this.subject.value;
    let message = this.message.value;

    let auxData: any = {};

    switch (this.type) {
      case 'requestAccess':
        auxData.offerId = this.offerId;
        auxData.offerName = this.offerName;
        ticketType = TicketTypeEnum.Request;
        break;
      case 'general':
      default:
    }

    this._apiModule.sendTicket(ticketType, subject, message, auxData)
      .then(() => {
        this._alertService.addAlert('Сообщение отправлено', AlertTypeEnum.Success, null, 'fa fa-check', 5000 );
        this.processing = false;
        this.sent = true;
        this.onSend.emit();
      })
      .catch(() => {
        this._alertService.addAlert('Сообщение не отправлено', AlertTypeEnum.Warning, null, 'fa fa-times', 5000 );
        this.processing = false;
      });

  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offerName'] || changes['offerId']) {
      this.newTicket.reset();
      this.subject.setValue('Request access to offer "' + this.offerName + '", id ' + this.offerId);
      if (this.type == 'requestAccess') {
        this.ticketType.setValue(0);
      }
    }
  }


}
