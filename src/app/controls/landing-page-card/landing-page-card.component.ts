import {Component, Input, OnInit} from '@angular/core';
import {LandingPage} from "../../models/landingPage";
import {ModelWrapper} from "../../models/modelWrapper";

@Component({
  selector: 'app-landing-page-card',
  templateUrl: './landing-page-card.component.html',
  styleUrls: ['./landing-page-card.component.css']
})
export class LandingPageCardComponent implements OnInit {

  @Input() model: ModelWrapper<LandingPage>;

  @Input() selectable: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  onClick() {
    if (this.selectable)
      this.model.selected = !this.model.selected;
  }

}
