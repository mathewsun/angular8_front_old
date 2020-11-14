import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LandingPage, LandingPageType } from '../../../models/landingPage';
import { EnumToArrayPipe } from '../../../models/pipes/enumToArray.pipe';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  public landingPage: LandingPage = null;
  public landingPageType: Array<string>;

  constructor(private _titleService: Title, private _route: ActivatedRoute) {
    let snapshot = _route.snapshot;
    this.landingPage = snapshot.data.landingPage;
    this.landingPageType = (new EnumToArrayPipe()).transform(LandingPageType);

    this._titleService.setTitle(this.landingPage.name + ' - C2M');
  };

  ngOnInit() {

  }

}

