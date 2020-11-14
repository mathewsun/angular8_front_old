import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-err404',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  public mode = 'user';
  public snapshot: ActivatedRouteSnapshot;

  constructor(
    private _titleService: Title,
    private _activatedRoute: ActivatedRoute) {
    this.snapshot = this._activatedRoute.snapshot;

    this.mode = this.snapshot.data.mode;
    this._titleService.setTitle(this.snapshot.data.title);
  }

  ngOnInit() {
  }

}
