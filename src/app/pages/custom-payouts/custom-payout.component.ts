import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-personal-stakes',
  templateUrl: './custom-payout.component.html',
  styleUrls: ['./custom-payout.component.css']
})
export class CustomPayoutComponent implements OnInit {

  public activatedRouteSnapshot: ActivatedRouteSnapshot;

  constructor(private _activatedRoute: ActivatedRoute) {
    this.activatedRouteSnapshot = _activatedRoute.snapshot;
  }

  ngOnInit() {
  }

}
