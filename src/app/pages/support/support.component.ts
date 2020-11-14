import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  constructor(
    private _titleService: Title,
    private _activatedRoute: ActivatedRoute,
    public _router: Router) {
    let snapshot = _activatedRoute.snapshot;
    this._titleService.setTitle(snapshot.data.title);
  }

  ngOnInit() {
  }

  public onSend() {
    this._router.navigateByUrl('/', { skipLocationChange: true });
  };

}
