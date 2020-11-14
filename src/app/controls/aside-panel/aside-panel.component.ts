import { Component, OnInit } from '@angular/core';
import { RolesCollection } from '../../models/role';
import { ApiModule } from '../../api/api.module';

@Component({
  selector: 'app-aside-panel',
  templateUrl: './aside-panel.component.html',
  styleUrls: ['./aside-panel.component.css']
})
export class AsidePanelComponent implements OnInit {

  public isAdmin: boolean = false;

  constructor() { }

  ngOnInit() {
    let roles: RolesCollection = ApiModule.Roles;
    this.isAdmin = roles.isInRole('Superuser');
  }

}
