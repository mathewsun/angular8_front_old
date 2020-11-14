import { Component, OnInit } from '@angular/core';
import { Offer } from '../../../models/offer';

@Component({
  selector: 'app-request-access-modal',
  templateUrl: './request-access-modal.component.html',
  styleUrls: ['./request-access-modal.component.css']
})
export class RequestAccessModalComponent implements OnInit {

  public isShow: Boolean = false;

  public offerId: number = null;
  public offerName: string = "";

  constructor() { }

  public show(offer: Offer) {
      this.offerId = offer.id;
      this.offerName = offer.name;
      this.isShow = true;
  }

  public close() {
    this.isShow = false;
  }

  onOutsideClick() {
    this.close();
  }

  public onSend() {
    this.close();
  }

  ngOnInit() {

  }

}
