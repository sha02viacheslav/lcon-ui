import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { ApiService } from '../../api.service';
import { SummaryType } from '@enums';
import { getSummaryQuery } from '../../@core/utils';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  readonly SummaryType = SummaryType;
  isLoading: boolean = true;
  currentYear = new Date().getFullYear();

  chartData: ChartData;
  chartType: ChartType = 'doughnut';
  chartOptions: ChartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  keys = new Map<number, string>()
    .set(0, 'firstOutbound')
    .set(1, 'secondOutbound')
    .set(2, 'firstInbound')
    .set(3, 'secondInbound')
    .set(4, 'invalid')
    .set(5, 'noResponse')
    .set(6, 'totalOutbound')
    .set(7, 'totalInbound')
    .set(8, 'totalUnreachable')
    .set(9, 'totalActivity');

  params = new Map<string, string>()
    .set(this.keys.get(0), 'firstnotificationdate IS NOT NULL AND secondnotificationdate IS NULL')
    .set(this.keys.get(1), 'secondnotificationdate IS NOT NULL')
    .set(
      this.keys.get(2),
      'firstnotificationdate IS NOT NULL AND secondnotificationdate IS NULL AND emailresponsedate IS NOT NULL',
    )
    .set(this.keys.get(3), 'secondnotificationdate IS NOT NULL AND emailresponsedate IS NOT NULL')
    .set(this.keys.get(4), "status LIKE '%Skipped%'")
    .set(this.keys.get(5), "emailresponsedate IS NULL AND status != 'Skipped' AND status != 'Completed'");

  queries = new Map<string, number>();

  weeklyTotals: any[];
  monthlyTotals: any[];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData() {
    this.isLoading = true;
    for (let i = 0; i < this.params.size; i++) {
      await this.api.getCount(this.params.get(this.keys.get(i))).then((res) => {
        this.queries.set(this.keys.get(i), Number(res.data));
      });
    }
    this.queries.set(this.keys.get(6), this.queries.get('firstOutbound') + this.queries.get('secondOutbound'));
    this.queries.set(this.keys.get(7), this.queries.get('firstInbound') + this.queries.get('secondInbound'));
    this.queries.set(this.keys.get(8), this.queries.get('invalid') + this.queries.get('noResponse'));
    this.queries.set(
      this.keys.get(9),
      this.queries.get('totalOutbound') + this.queries.get('totalInbound') + this.queries.get('totalUnreachable'),
    );

    this.loadChart();
    await this.getPastWeekSummary();
    await this.getPastYearSummary();
    this.isLoading = false;
  }

  private loadChart(): void {
    this.chartData = {
      labels: ['Outbound', 'Inbound', 'Unreachable'],
      datasets: [
        {
          label: 'Total',
          backgroundColor: ['#0D62FF', '#8BE1FA', '#A89FFF'],
          data: [
            this.queries.get('totalOutbound'),
            this.queries.get('totalInbound'),
            this.queries.get('totalUnreachable'),
          ],
        },
      ],
    };
  }

  handleChangeDateFilter(value: any) {
    console.log('Change Date Filter', value);
  }

  private async getPastWeekSummary() {
    const data = {};
    for (let i = 0; i < 7; i++) {
      data[moment().subtract(i, 'days').format('YYYY-MM-DD')] = {
        firstOutbound: 0,
        secondOutbound: 0,
        totalOutbound: 0,
        firstInbound: 0,
        secondInbound: 0,
        totalInbound: 0,
        invalid: 0,
        noResponse: 0,
        totalUnreachable: 0,
      };
    }
    for (let i = 0; i < this.keys.size - 1; i++) {
      await this.api.getPastWeekSummary(getSummaryQuery(this.keys.get(i) as SummaryType)).then((res) => {
        res.data?.forEach((item) => {
          if (data[item.date]) {
            data[item.date][this.keys.get(i)] = item.count;
          }
        });
      });
    }

    this.weeklyTotals = [];

    Object.keys(data).forEach((key) => {
      this.weeklyTotals.push({ date: key, ...data[key] });
    });
  }

  private async getPastYearSummary() {
    const data = {};
    for (let i = 0; i < 12; i++) {
      data[moment().month(i).format('YYYY-MM')] = {
        firstOutbound: 0,
        secondOutbound: 0,
        totalOutbound: 0,
        firstInbound: 0,
        secondInbound: 0,
        totalInbound: 0,
        invalid: 0,
        noResponse: 0,
        totalUnreachable: 0,
      };
    }
    for (let i = 0; i < this.keys.size - 1; i++) {
      await this.api.getPastYearSummary(getSummaryQuery(this.keys.get(i) as SummaryType)).then((res) => {
        res.data?.forEach((item) => {
          if (data[item.date]) {
            data[item.date][this.keys.get(i)] = item.count;
          }
        });
      });
    }

    console.log(data);

    this.monthlyTotals = [];

    Object.keys(data).forEach((key) => {
      this.monthlyTotals.push({ date: `${key}-15`, ...data[key] });
    });
  }
}
