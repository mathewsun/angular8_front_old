import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit {

  public snapshot: ActivatedRouteSnapshot;
  public admin: boolean = false;

  constructor(private _titleService: Title, private _activatedRoute: ActivatedRoute) {
    this.snapshot = _activatedRoute.snapshot;
    this.admin = this.snapshot.data.admin;

    this._titleService.setTitle(this.snapshot.data.title);
  }

  ngOnInit() {

  }


}
