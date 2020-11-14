import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserModule } from '../../api/user.module';
import { animate, style, transition, trigger } from '@angular/animations';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-header-mobile',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('200ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('200ms', style({opacity: 0}))
        ])
      ]
    )
  ],
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.css']
})

export class HeaderMobileComponent implements OnInit, OnDestroy {

  public isAdmin: boolean = false;
  public user: User = null;
  public isActive: boolean = false;
  public routerEventSubscription;

  constructor(private _userModule: UserModule, private _router: Router) {
  }

  ngOnInit() {
    this.user = this._userModule.currentUser;
    this._userModule.userChanged.subscribe(user => {
      this.user = user;
    });

    this.isAdmin = !!this.user.roles.find((el) => {
      return el.id == 3;
    });

    this.routerEventSubscription = this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isActive = false;
      }
    });
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe;
  }

  clickedOutside() {
    if (this.isActive) {
      this.isActive = false;
    }
  }
}
