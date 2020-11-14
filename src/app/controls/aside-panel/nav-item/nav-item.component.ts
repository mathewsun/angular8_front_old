import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent implements OnInit {

  @Input('model') model: {
    name: string,
    icon: string,
    text: string,
    routerLink: string,
    linkOption: { exact: boolean },
    roles: string[],
    expanded: boolean,
    subItems: [
      {
        name: string,
        icon: string,
        text: string,
        routerLink: string,
        linkOption: { exact: boolean },
        roles: string[],
        subItems: []
      }
    ]
  };

  @Input('expanded') expanded: boolean = false;

  @ViewChild(RouterLinkActive, {static: false}) public routerLinkActive: RouterLinkActive;

  constructor() {
  }

  ngOnInit() {
  }

}
