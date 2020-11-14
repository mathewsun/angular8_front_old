import {Component, OnInit} from '@angular/core';
import {transportServiceProvider} from '../../services/transport/transport.service.provider';
import {StatisticsModule} from "../../api/statistics.module";

@Component({
  providers: [transportServiceProvider],
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {

  constructor(private statisticsModule: StatisticsModule) {
  }

  ngOnInit() {
  }

}
