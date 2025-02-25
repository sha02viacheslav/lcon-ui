import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { ApiService } from '../../api.service';
import { SummaryType } from '@enums';
import { getSummaryQuery } from '../../@core/utils';
import * as moment from 'moment/moment';
import { BlockUIService } from 'ng-block-ui';
import { DateFilterComponent } from '../../date-filter/date-filter.component';
import { SearchItem } from '@models';
import { MultipleSearchComponent } from '../../shared/components/multiple-search/multiple-search.component';
import { ChartComponent } from '../../chart/chart.component';
import { CHART_COLORS } from '../../@core/constants';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  readonly SummaryType = SummaryType;
  currentYear = new Date().getFullYear();
  dateFilter: { start: string; end: string };
  searchItems: SearchItem[] = [];

  chartData: ChartData;
  chartType: ChartType = 'doughnut';
  chartOptions: ChartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      datalabels: {
        display: true,
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
    .set(this.keys.get(4), "status = 'Skipped'")
    .set(this.keys.get(5), "emailresponsedate IS NULL AND status != 'Skipped' AND status != 'Completed'");

  queries = new Map<string, number>();

  weeklyTotals: any[];
  monthlyTotals: any[];

  @ViewChild('dateFilterComponent') dateFilterComponent: DateFilterComponent;
  @ViewChild('multipleSearchComponent') multipleSearchComponent: MultipleSearchComponent;
  @ViewChild('chartComponent') chartComponent: ChartComponent;

  constructor(
    private api: ApiService,
    private blockUIService: BlockUIService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData() {
    this.blockUIService.start('APP', `Loading...`);
    const promises = [];
    for (let i = 0; i < this.params.size; i++) {
      promises.push(
        new Promise((resolve) => {
          this.api
            .getCount({
              rawWhere: this.params.get(this.keys.get(i)),
              multipleSearch: JSON.stringify(this.searchItems),
              ...this.dateFilter,
            })
            .subscribe((res) => {
              this.queries.set(this.keys.get(i), Number(res.result));
              resolve(res.result);
            });
        }),
      );
    }

    Promise.all(promises).then(() => {
      this.queries.set(this.keys.get(6), this.queries.get('firstOutbound') + this.queries.get('secondOutbound'));
      this.queries.set(this.keys.get(7), this.queries.get('firstInbound') + this.queries.get('secondInbound'));
      this.queries.set(this.keys.get(8), this.queries.get('invalid') + this.queries.get('noResponse'));
      this.queries.set(
        this.keys.get(9),
        this.queries.get('totalOutbound') + this.queries.get('totalInbound') + this.queries.get('totalUnreachable'),
      );

      this.loadChart();
      this.getPastWeekSummary();
      this.getPastYearSummary();
      this.blockUIService.stop('APP');
    });
  }

  private loadChart(): void {
    this.chartData = {
      labels: ['Outbound', 'Inbound', 'Unreachable'],
      datasets: [
        {
          label: 'Total',
          backgroundColor: CHART_COLORS,
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
    this.dateFilter = value;
    this.loadData();
  }

  handleChangeSearch(value: SearchItem[]) {
    this.searchItems = value;
    this.loadData();
  }

  clearFilters() {
    this.dateFilterComponent.clear();
    this.dateFilter = null;
    if (this.searchItems) {
      // Clear search will run loadData()
      this.multipleSearchComponent.clearSearch();
    } else {
      this.loadData();
    }
  }

  downloadChart() {
    this.chartComponent.saveChart('summary-chart.jpeg');
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

    this.monthlyTotals = [];

    Object.keys(data).forEach((key) => {
      this.monthlyTotals.push({ date: `${key}-15`, ...data[key] });
    });
  }
}
