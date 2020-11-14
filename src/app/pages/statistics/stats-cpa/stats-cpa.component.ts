import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StatisticsModule } from '../../../api/statistics.module';
import { StatRecord } from '../../../models/statRecord';
import { ModelWrapper } from '../../../models/modelWrapper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { MultiSelectComponent } from '../../../controls/multi-select/multi-select.component';
import { StatIndicatorCalculatorService } from '../../../services/statIndicatorCalculator.service';
import { SelectComponent } from '../../../controls/select/select.component';
import { Title } from '@angular/platform-browser';
import { GoodStatisticsModule } from '../../../api/goodStatistics.module';
import { WrapModelArrayPipe } from '../../../models/pipes/wrapModel.pipe';

@Component({
  selector: '',
  templateUrl: './stats-cpa.component.html',
  styleUrls: ['./stats-cpa.component.css']
})
export class StatsCPAComponent implements OnInit, OnDestroy {

  public datePickerForm: FormGroup;
  public filtersForm: FormGroup;
  public groupBy;
  public snapshot: ActivatedRouteSnapshot;
  public processing: boolean = false;
  public adminMode: boolean = false;

  public filterChanged: boolean = true;

  public filtersFormSubscription;
  public datePickerFormSubscription;

  public wrapModelArray: WrapModelArrayPipe = new WrapModelArrayPipe();

  public timezone: string = '';

  @ViewChild('offersSelect', {
    static: true,
    read: MultiSelectComponent
  }) offersSelect: MultiSelectComponent;

  @ViewChild('streamsSelect', {
    static: true,
    read: MultiSelectComponent
  }) streamsSelect: MultiSelectComponent;

  @ViewChild('usersSelect', {
    static: true,
    read: MultiSelectComponent
  }) usersSelect: MultiSelectComponent;

  @ViewChild('statModuleToggle', {
    static: true
  }) statModuleToggle;

  public _statToggle: boolean = false;

  private get _statisticsModule() {
    //let checked = this.statModuleToggle ? this.statModuleToggle.nativeElement.checked : false;
    let checked = this.datePickerForm.get('statModuleToggle').value || false;
    return checked ? this._goodStatisticsModule : this._badStatisticsModule;
  }

  constructor(
    private _titleService: Title,
    private _badStatisticsModule: StatisticsModule,
    private _goodStatisticsModule: GoodStatisticsModule,
    private _activatedRoute: ActivatedRoute,
    private _statIndicatorCalc: StatIndicatorCalculatorService,
    private _router: Router) {
    this.datePickerForm = new FormGroup({
      'dateFrom': new FormControl(new Date(), Validators.required),
      'dateTo': new FormControl(new Date(), Validators.required),
      'statModuleToggle': new FormControl(false)
    });

    this.filtersForm = new FormGroup({
      'offers': new FormControl([]),
      'streams': new FormControl([]),
      'countries': new FormControl([]),
      'users': new FormControl([]),
      'subId1': new FormControl(null),
      'subId2': new FormControl(null),
      'subId3': new FormControl(null),
      'subId4': new FormControl(null),
      'subId5': new FormControl(null)
    });

    this.snapshot = _activatedRoute.snapshot;

    //this._statisticsModule = _badStatisticsModule;

    this._titleService.setTitle(this.snapshot.data.title);
  }

  public selectedPeriod: string = 'week';
  public predefinedPeriods = [
    'today',
    'yesterday',
    'week',
    'month',
    'thisMonth',
    'lastMonth',
  ];

  // *****************
  // Total by columns

  get emptyTotal() {
    return {
      totalClicks: 0,
      totalLeads: 0,
      uniqueClicks: 0,
      trafficBackClicks: 0,
      payClicks: 0,
      holdClicks: 0,
      rejectClicks: 0,
      payPayout: 0,
      holdPayout: 0,
      rejectPayout: 0,
      platformPayout: 0,
      smsCosts: 0
    };
  };

  public statsTotal = this.emptyTotal;

  // *****************
  // Storing data from server

  public sortSelected = {
    type: 'date',
    ascending: false,
  };

  public statType = {
    type: 'date',
    text: 'Day',
  };

  get defaultHeaders() {
    return [
      {
        text: 'Traffic',
        subText: 'Clicks / Unique',
        type: 'totalClicks'
      },
      {
        text: 'tB',
        type: 'trafficBackClicks'
      },
      {
        text: 'CR%',
        type: 'conversionRate'
      },
      {
        text: 'AR%',
        type: 'approveRate'
      },
      {
        text: 'EPC',
        type: 'earnPerClickRate'
      },
      {
        text: 'Accepted',
        subText: 'Leads / Sum',
        type: 'payClicks'
      },
      {
        text: 'On hold',
        subText: 'Leads / Sum',
        type: 'holdClicks'
      },
      {
        text: 'Rejected',
        subText: 'Leads / Sum',
        type: 'rejectClicks'
      },
      {
        text: 'Total',
        type: 'totalLeads'
      },
    ];
  }

  public statsHeaders = this.defaultHeaders;

  public statsArray: StatRecord[] = [];
  public statsArrayWrapped: ModelWrapper<StatRecord>[] = [];

  ngOnInit() {
    this.adminMode = this.snapshot.data.adminMode;
    this.selectPeriod('week', null);
    this.groupBy = '1';
    this.statsHandler(this.snapshot.data.stats);
    if (this.adminMode) {
      this.statsHeaders.push(
        {
          text: 'Income',
          type: 'platformPayout'
        }
      );
    }

    // filling filter from query params
    this.updateQueueParamsFromFilters(this.snapshot.queryParamMap);

    // subscription to filters change
    this.filtersFormSubscription = this.filtersForm.valueChanges.subscribe(() => {
      this.toggleFilters();
    });

    // subscription to date change
    this.datePickerFormSubscription = this.datePickerForm.valueChanges.subscribe(() => {
      this.toggleFilters();
    });
  }

  ngOnDestroy() {
    this.filtersFormSubscription.unsubscribe;
    this.datePickerFormSubscription.unsubscribe;
  }

  // *****************
  // Get data

  @ViewChild('groupBySelect', {static: true, read: SelectComponent}) groupBySelect: SelectComponent;

  private getStat() {
    this.processing = true;
    this.groupBy = this.groupBySelect.value || '1';

    let filters = this.extractFilters();

    let dateFrom = moment(this.datePickerForm.get('dateFrom').value).startOf('day').toDate();
    let dateTo = moment(this.datePickerForm.get('dateTo').value).endOf('day').toDate();

    switch (this.groupBy) {
      case 'offer': //////////////////////////////////////////////
        this.resetHeaders();
        this.statType.type = 'name';
        this._statisticsModule.loanByOffer(
          dateFrom,
          dateTo,
          null,
          filters)
          .then(res => {
            this.statsHandler(res);
            this.processing = false;
          });
        break;
      case 'stream': //////////////////////////////////////////////
        if (this.adminMode) {
          this.resetHeaders();
          this.statsHeaders.push(
            {
              text: 'Sms cost',
              type: 'smsCosts'
            }
          );
        }
        this.statType.type = 'name';
        this._statisticsModule.loanByStream(
          dateFrom,
          dateTo,
          null,
          filters)
          .then(res => {
            this.statsHandler(res);
            this.processing = false;
          });
        break;
      case 'user': //////////////////////////////////////////////
        this.resetHeaders();
        this.statType.type = 'name';
        this._statisticsModule.loanByUser(
          dateFrom,
          dateTo,
          filters)
          .then(res => {
            this.statsHandler(res);
            this.processing = false;
          });
        break;
      default: //////////////////////////////////////////////
        this.resetHeaders();
        this.statType.type = 'date';
        this._statisticsModule.loanByDate(
          dateFrom,
          dateTo,
          null,
          this.groupBy,
          filters)
          .then(res => {
            if (res.length > 0) {
              this.timezone = res[0].date.toString().substr(res[0].date.toString().length - 6, 6);
            }
            this.statsHandler(res);
            this.processing = false;
          });
        break;
    }
  }

  statsHandler(res: StatRecord[]) {
    this.sortReset();
    this.statsArray = this._statIndicatorCalc.calculateIndicators(res);
    this.statsArrayWrapped = ModelWrapper.wrapArray<StatRecord>(this.statsArray);
    this.statsTotal = this.emptyTotal;
    this.statsTotal = this.calculateTotals(this.statsTotal, this.statsArray);
  }

  sortByType(type: string) {
    if (type === this.sortSelected.type) {
      this.sortSelected.ascending = !this.sortSelected.ascending;
      if (this.sortSelected.ascending) {
        this.statsArray.sort(function(a, b) {
          return a[type] > b[type] ? 1 : a[type] < b[type] ? -1 : 0;
        });
      } else {
        this.statsArray.sort(function(a, b) {
          return a[type] < b[type] ? 1 : a[type] > b[type] ? -1 : 0;
        });
      }
    } else {
      this.sortSelected.type = type;
      this.sortSelected.ascending = false;
      this.statsArray.sort(function(a, b) {
        return a[type] < b[type] ? 1 : a[type] > b[type] ? -1 : 0;
      });
    }
  }

  sortReset() {
    let type = this.statType.type;
    this.sortSelected.type = type;
    this.sortSelected.ascending = false;
    this.statsArray.sort(function(a, b) {
      return a[type] > b[type] ? 1 : a[type] < b[type] ? -1 : 0;
    });
  };

  /**
   *
   * @param period
   * @param event
   */
  public selectPeriod(period: string, event): void {

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedPeriod = period;

    let to: Moment = moment();
    let from: Moment = moment();

    switch (period) {
      case 'today':
        from.startOf('day');
        break;
      case'yesterday':
        from.subtract(1, 'day').startOf('day');
        to.subtract(1, 'day').endOf('day');
        break;
      case 'week':
        from = from.subtract(6, 'd').endOf('day');
        break;
      case 'month':
        from.subtract(1, 'month').startOf('day');
        break;
      case 'thisMonth':
        from.startOf('month').startOf('day');
        break;
      case 'lastMonth':
        from.subtract(1, 'month').startOf('month');
        to.subtract(1, 'month').endOf('month');
        break;
    }

    this.datePickerForm.patchValue({
      dateFrom: from.toDate(),
      dateTo: to.toDate()
    });
  }

  /**
   *
   */
  extractFilters(): any {
    let rawFilters = this.filtersForm.getRawValue();

    let filters: any = {
      webFields: {}
    };

    if (this.adminMode) {
      if (this.snapshot.data.users.length == this.filtersForm.get('users').value.length) {
        filters.users = null;
      } else {
        filters.users = rawFilters.users && rawFilters.users.map(w => w.value.id);
      }
    }

    if (this.snapshot.data.offers.length == this.filtersForm.get('offers').value.length) {
      filters.offers = null;
    } else {
      filters.offers = rawFilters.offers && rawFilters.offers.map(w => w.value.id);
    }

    if (this.snapshot.data.streams.length == this.filtersForm.get('streams').value.length) {
      filters.streams = null;
    } else {
      filters.streams = rawFilters.streams && rawFilters.streams.map(w => w.value.id);
    }

    if (rawFilters.subid1) {
      filters.webFields.subid1 = rawFilters.subid1;
    }
    if (rawFilters.subid2) {
      filters.webFields.subid2 = rawFilters.subid2;
    }
    if (rawFilters.subid3) {
      filters.webFields.subid3 = rawFilters.subid3;
    }
    if (rawFilters.subid4) {
      filters.webFields.subid4 = rawFilters.subid4;
    }
    if (rawFilters.subid5) {
      filters.webFields.subid5 = rawFilters.subid5;
    }

    filters.timezone = moment.tz.guess();

    return filters;
  }

  public calculateTotals(obj, stats: StatRecord[]) {
    this.statsTotal = this.emptyTotal;
    for (let key in obj) {
      stats.map(el => {
        obj[key] = obj[key] + el[key];
      });
    }
    return obj;
  }

  /**
   *
   */
  update() {
    if (this.filterChanged) {
      this.filterChanged = false;
      this.updateFiltersInQueryParams();
      this.getStat();
    }
  }

  public exportAsCSV() {
    if (this.statsArray.length == 0) {
      return;
    } else {
      let csvContent = 'data:text/csv;charset=utf-8,';

      switch (this.groupBy) {
        case '0' :
          csvContent = csvContent + 'Hour';
          break;
        case '1' :
          csvContent = csvContent + 'Day';
          break;
        case '2' :
          csvContent = csvContent + 'Week';
          break;
        case '3' :
          csvContent = csvContent + 'Month';
          break;
        case 'offer' :
          csvContent = csvContent + 'Stream';
          break;
        case 'stream' :
          csvContent = csvContent + 'Offer';
          break;
        case 'user' :
          csvContent = csvContent + 'User';
          break;
      }

      csvContent = csvContent +
        ',total clicks' +
        ',unique clicks' +
        ',CR%' +
        ',AR%' +
        ',EPC' +
        ',accepted leads' +
        ',accepted sum' +
        ',leads on hold' +
        ',sum on hold' +
        ',rejected leads' +
        ',rejected sum' +
        ',total leads';

      this.adminMode ? csvContent = csvContent + ', income\n' : csvContent = csvContent + '\n';

      this.statsArray.map(el => {
        switch (this.groupBy) {
          case '0' :
            csvContent = csvContent + el.date;
            break;
          case '1' :
            csvContent = csvContent + el.date;
            break;
          case '2' :
            csvContent = csvContent + el.date;
            break;
          case '3' :
            csvContent = csvContent + el.date;
            break;
          case 'offer' :
            csvContent = csvContent + '"' + el.name + '"';
            break;
          case 'stream' :
            csvContent = csvContent + '"' + el.name + '"';
            break;
          case 'user' :
            csvContent = csvContent + '"' + el.name + '"';
            break;
        }
        csvContent = csvContent +
          ',' + el.totalClicks +
          ',' + el.uniqueClicks +
          ',' + (el.conversionRate * 100).toFixed(2) +
          ',' + (el.approveRate * 100).toFixed(2) +
          ',' + el.earnPerClickRate.toFixed(2) +
          ',' + el.payClicks +
          ',' + el.payPayout +
          ',' + el.holdClicks +
          ',' + el.holdPayout +
          ',' + el.rejectClicks +
          ',' + el.rejectPayout +
          ',' + el.totalLeads;
        this.adminMode ? csvContent = csvContent + el.platformPayout + '\n' : csvContent = csvContent + '\n';
      });
      var encodedURI = encodeURI(csvContent);

      var hiddenAnchor = document.createElement('a');
      hiddenAnchor.href = encodedURI;
      hiddenAnchor.target = '_blank';
      hiddenAnchor.download = 'output.csv';
      hiddenAnchor.click();
    }
  }

  /**
   * Clear all forms
   * @param formGroup - The form group to clear
   */
  public clearFilters(formGroup: FormGroup) {
    (<any> Object).values(formGroup.controls).forEach(control => {
      control.reset();
      if (control.controls) {
        this.clearFilters(control);
      }
    });
  }

  rangeLimitation(which: string) {
    let dateFrom = moment(this.datePickerForm.get('dateFrom').value).startOf('day');
    let dateTo = moment(this.datePickerForm.get('dateTo').value).endOf('day');

    if (dateTo.diff(dateFrom, 'days') > 93) {
      switch (which) {
        case 'from': {
          this.datePickerForm.get('dateTo').setValue(dateFrom.add(93, 'days').toDate());
          break;
        }
        case 'to': {
          this.datePickerForm.get('dateFrom').setValue(dateTo.subtract(93, 'days').toDate());
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  private resetHeaders() {
    this.statsHeaders = this.defaultHeaders;
    if (this.adminMode) {
      this.statsHeaders.push(
        {
          text: 'Income',
          type: 'platformPayout'
        }
      );
    }
  }

  updateQueueParamsFromFilters(e) {
    // getting values from query params

    let filter: any = {};

    if (this.adminMode) {
      if (e.get('users') == 'all' || e.get('users') == null) {
        filter.users = null;
      } else {
        filter.users = this.idsToStuffListConverter(e.get('users').split(',').map(el => parseInt(el)), this.snapshot.data.users);
      }
    }

    if (e.get('streams') == 'all' || e.get('streams') == null) {
      filter.streams = null;
    } else {
      filter.streams = this.idsToStuffListConverter(e.get('streams').split(',').map(el => parseInt(el)), this.snapshot.data.streams);
    }

    if (e.get('offers') == 'all' || e.get('offers') == null) {
      filter.offers = null;
    } else {
      filter.offers = this.idsToStuffListConverter(e.get('offers').split(',').map(el => parseInt(el)), this.snapshot.data.offers);
    }

    filter.subId1 = e.get('subId1') || null;
    filter.subId2 = e.get('subId2') || null;
    filter.subId3 = e.get('subId3') || null;
    filter.subId4 = e.get('subId4') || null;
    filter.subId5 = e.get('subId5') || null;

    filter.groupBy = e.get('groupBy') || null;

    filter.dateFrom = e.get('dateFrom') || null;
    filter.dateTo = e.get('dateTo') || null;

    // updating form

    if (filter.dateFrom) {
      this.datePickerForm.get('dateFrom').patchValue(new Date(+filter.dateFrom));
    }

    if (filter.dateTo) {
      this.datePickerForm.get('dateTo').patchValue(new Date(+filter.dateTo));
    }

    if (filter.subId1) {
      this.filtersForm.get('subId1').patchValue(filter.subId1);
    }

    if (filter.subId2) {
      this.filtersForm.get('subId2').patchValue(filter.subId2);
    }

    if (filter.subId3) {
      this.filtersForm.get('subId3').patchValue(filter.subId3);
    }

    if (filter.subId4) {
      this.filtersForm.get('subId4').patchValue(filter.subId4);
    }

    if (filter.subId5) {
      this.filtersForm.get('subId5').patchValue(filter.subId5);
    }

    if (filter.groupBy) {
      this.groupBySelect.value = filter.groupBy;
    }

    if (this.adminMode) {
      if (filter.users) {
        this.filtersForm.get('users').patchValue(this.wrapModelArray.transform(filter.users));
      }
    }

    if (filter.offers) {
      this.filtersForm.get('offers').patchValue(this.wrapModelArray.transform(filter.offers));
    }

    if (filter.streams) {
      this.filtersForm.get('streams').patchValue(this.wrapModelArray.transform(filter.streams));
    }
    this.getStat();

  }

  updateFiltersInQueryParams() {

    let queryParams: any = {};

    // getting values from controls

    //dateFrom
    queryParams.dateFrom = this.datePickerForm.get('dateFrom').value.valueOf();

    //dateTo
    queryParams.dateTo = this.datePickerForm.get('dateTo').value.valueOf();

    //groupBy
    if (this.groupBySelect.value) {
      queryParams.groupBy = this.groupBySelect.value;
    }

    //offers
    if (this.filtersForm.get('offers').value) {
      if (this.filtersForm.get('offers').value.length !== 0 && this.filtersForm.get('offers').value.length !== this.snapshot.data.offers.length) {
        queryParams.offers = this.wrappedStuffToIdListConverter(this.filtersForm.get('offers').value).join(',');
      }
    }

    //streams
    if (this.filtersForm.get('streams').value) {
      if (this.filtersForm.get('streams').value.length !== 0 && this.filtersForm.get('streams').value.length !== this.snapshot.data.streams.length) {
        queryParams.streams = this.wrappedStuffToIdListConverter(this.filtersForm.get('streams').value).join(',');
      }
    }

    //webmasters// if admin
    if (this.adminMode) {
      if (this.filtersForm.get('users').value) {
        if (this.filtersForm.get('users').value.length !== 0 && this.filtersForm.get('users').value.length !== this.snapshot.data.users.length) {
          queryParams.users = this.wrappedStuffToIdListConverter(this.filtersForm.get('users').value).join(',');
        }
      }
    }

    //subId1
    if (this.filtersForm.get('subId1').value) {
      queryParams.subId1 = this.filtersForm.get('subId2').value;
    }

    //subId2
    if (this.filtersForm.get('subId2').value) {
      queryParams.subId2 = this.filtersForm.get('subId2').value;
    }

    //subId3
    if (this.filtersForm.get('subId3').value) {
      queryParams.subId3 = this.filtersForm.get('subId3').value;
    }

    //subId4
    if (this.filtersForm.get('subId4').value) {
      queryParams.subId4 = this.filtersForm.get('subId4').value;
    }

    //subId5
    if (this.filtersForm.get('subId5').value) {
      queryParams.subId5 = this.filtersForm.get('subId5').value;
    }

    this._router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: '',
    });
  }

  toggleFilters() {
    this.filterChanged = true;
  }

  idsToStuffListConverter(ids: number[] = [], stuffWithIds: any[] = []) {
    let result: any[] = [];

    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < stuffWithIds.length; j++) {
        if (stuffWithIds[j].id == ids[i]) {
          result.push(stuffWithIds[j]);
          break;
        }
      }
    }
    return result;
  }

  wrappedStuffToIdListConverter(stuffWithIds: ModelWrapper[] = []) {
    let result: any[] = [];

    for (let i = 0; i < stuffWithIds.length; i++) {
      result.push(stuffWithIds[i].value.id);
    }
    return result;
  }
}


