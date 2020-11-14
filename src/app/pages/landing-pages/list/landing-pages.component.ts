import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { LandingPageFilter } from '../../../models/filters/landingPage.filter';
import { LandingPageListService } from '../../../services/transport/landing-page-list.service';

@Component({
  selector: 'app-landing-pages',
  templateUrl: './landing-pages.component.html',
  styleUrls: ['./landing-pages.component.css'],
  providers: [LandingPageListService]
})

export class LandingPagesComponent implements OnInit, OnDestroy {

  public landingPages = [];

  public filtersFormGroup: FormGroup;

  public snapshot: ActivatedRouteSnapshot;

  public pageCount: number = 9;
  public pageSelected: number = 1;
  public itemsPerPage: number = 20;
  public filter: LandingPageFilter = {};

  public queryParamMapSubscription;
  public filtersFormSubscription;

  public filterChanged: boolean = true;

  public loading: boolean = true;

  constructor(
    private _titleService: Title,
    private _activatedRoute: ActivatedRoute,
    private _landingPageListService: LandingPageListService,
    private _router: Router,
  ) {
    this.snapshot = _activatedRoute.snapshot;

    this._titleService.setTitle(this.snapshot.data.title);

    this.filtersFormGroup = new FormGroup({
      'searchInput': new FormControl(null),
    });
  }


  ngOnInit() {

    // filling filter from query params
    this.updateFiltersFromQueryParams(this.snapshot.queryParamMap);

    // patching value(s) in filters form
    this.searchInput.patchValue(this.filter.search ? this.filter.search : null);

    // subscriptions to params switch
    this.queryParamMapSubscription = this._activatedRoute.queryParamMap.subscribe((answer) => {

      // updating page number from param query
      this.updatePageSelected(answer);

      this.loading = true;
      this.landingPages = [];

      this._landingPageListService.getLandingPageList(this.filter, this.pageSelected, this.itemsPerPage).then(async res => {
        this.landingPages = res.items;

        if (res.items.length == 0 && this.pageSelected !== 1) {
          this.addQueryParams(this.filter.search, 1);
        } else {
          let pageCount = Math.ceil(res.itemsCount / this.itemsPerPage);

          if (pageCount == 0) {
            this.pageCount = 1;
          } else {
            this.pageCount = pageCount;
          }

          this.loading = false;
        }
      }).catch(() => {
        this.loading = false;
      });
    });

    // subscription to filters change
    this.filtersFormSubscription = this.filtersFormGroup.valueChanges.subscribe(() => {
      this.toggleFilters();
    });
  }

  ngOnDestroy() {
    this.filtersFormSubscription.unsubscribe();
    this.queryParamMapSubscription.unsubscribe();
  }

  get searchInput() {
    return this.filtersFormGroup.get('searchInput') as FormControl;
  }

  public toggleFilters() {
    this.filterChanged = true;
  }

  public addQueryParams(search: string = null, page: number = 1) {
    let queryParams: any = {};

    if (search) {
      queryParams.search = search;
    }

    queryParams.page = page;

    this._router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: '',
    });
  }

  public updateFiltersInQueryParams() {

    if (!this.filterChanged) {
      return;
    }

    let filter: LandingPageFilter = {search: null};

    filter.search = this.searchInput.value;

    this.addQueryParams(filter.search, 1);

    this.filter = filter;

    this.filterChanged = false;
  };

  public clearFilters() {
    this.resetFormGroup(this.filtersFormGroup);
    this.toggleFilters();
    this.filter = {};
  }

  public resetFormGroup(formGroup: FormGroup) {
    (<any> Object).values(formGroup.controls).forEach(control => {
      control.reset();

      if (control.controls) {
        this.resetFormGroup(control);
      }

    });
  }

  updateFiltersFromQueryParams(e) {

    let filter: any = {};

    this.pageSelected = parseInt(e.get('page')) || 1;
    filter.search = e.get('search') || null;

    //updating this.filter
    this.filter = filter;
  }

  updatePageSelected(e) {
    this.pageSelected = parseInt(e.get('page')) || 1;
  }

}
