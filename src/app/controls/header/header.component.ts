import { Component, ElementRef, OnInit } from '@angular/core';
import { ApiModule } from '../../api/api.module';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserModule } from '../../api/user.module';
import { DictionaryModule } from '../../api/dictionary.module';
import { Balance } from '../../models/balance';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _eRef: ElementRef, private _apiModule: ApiModule, private _router: Router, private _userModule: UserModule, private _dictionaryModule: DictionaryModule) {
    if (ENVIRONMENT.TARGET_BRANCH == "dev") {this.isDev = true}
  }

  public selectedBalance: Balance = null;

  public balances: Balance[] = [];

  public user: User = null;
  public username: string = null;
  public isAdmin: boolean = false;
  public isDev: boolean = false;

  ngOnInit() {

    this._userModule.getBalances().then(balances => {
        balances.forEach(el => {
          if (el.amount) {
            this.balances.push(el);
          }
        });
        if (this.balances.length == 0) {
          this.balances.push(
            {
              currency: {
                id: 9000,
                isoCode: 'USD',
                symbol: '$'
              },
              amount: 0
            }
          );
        }
        this.currencySelect(this.balances[0]);
      }
    );

    this.user = this._userModule.currentUser;
    this._userModule.userChanged.subscribe(user => {
      this.user = user;
    });

    this.isAdmin = !!this.user.roles.find((el) => {
      return el.id == 3;
    });

    if (this.user.profile.firstName && this.user.profile.lastName) {
      this.username = this.user.profile.firstName + ' ' + this.user.profile.lastName;
    } else {
      this.username = null;
    }

  }

  currencySelect(balance: Balance) {
    if (balance) {
      this.selectedBalance = balance;
    }
  }

  public signOut() {
    this._apiModule.logout();
    this._router.navigate(['/sign-in']);
  }
}
