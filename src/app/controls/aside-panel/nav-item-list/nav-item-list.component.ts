import { Component, Input, OnInit } from '@angular/core';
import { ApiModule } from '../../../api/api.module';
import { NavigationMenuService } from '../../../services/navigation-menu.service';

@Component({
  selector: 'app-nav-item-list',
  templateUrl: './nav-item-list.component.html',
  styleUrls: ['./nav-item-list.component.css']
})
export class NavItemListComponent implements OnInit {

  public navbarElements = [];
  @Input() mobile: boolean = false;

  constructor(
    private _apiModule: ApiModule,
    private _navigationMenuService: NavigationMenuService
  ) {
    this.navbarElements = _navigationMenuService.navbarElements;
  }

  public expandedId: number = 0;

  ngOnInit() {
  }

  expandItem(i: number) {
    this.navbarElements[this.expandedId].expanded = false;
    this.expandedId = i;
    this.navbarElements[i].expanded = true;
  }
}
