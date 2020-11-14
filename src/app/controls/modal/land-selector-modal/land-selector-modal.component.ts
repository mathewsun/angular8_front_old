import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LandingPage} from "../../../models/landingPage";
import {ModelWrapper} from "../../../models/modelWrapper";

@Component({
  selector: 'app-land-selector-modal',
  templateUrl: './land-selector-modal.component.html',
  styleUrls: ['./land-selector-modal.component.css']
})
export class LandSelectorModalComponent implements OnInit {

  public data: string = "initial data";
  public isShow: Boolean = false;

  public model: {
    landingPages: ModelWrapper<LandingPage>[],
    offerId: number
  } = {landingPages: [], offerId: 0};

  public landingPages: ModelWrapper<LandingPage>[];

  public confirmed: EventEmitter<{
    landingPages: ModelWrapper<LandingPage>[],
    offerId: number
  }>
    = new EventEmitter();
  public rejected: EventEmitter<null> = new EventEmitter();

  constructor() {
    this.isShow = false;
  }

  ngOnInit() {
  }

  public show() {
    this.isShow = true;
  }

  public close(confirm: boolean = false) {
    if (confirm)
      this.confirmed.emit(this.model);
    else
      this.rejected.emit();

    this.isShow = false;
  }

  onOutsideClick() {
    this.close();
  }

}
