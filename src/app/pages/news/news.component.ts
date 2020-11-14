import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public snapshot: ActivatedRouteSnapshot;

  constructor(private _titleService: Title, private _activatedRoute: ActivatedRoute) {
    this.snapshot = _activatedRoute.snapshot;

    this._titleService.setTitle(this.snapshot.data.title);
  }

  ngOnInit() {
  }

}
