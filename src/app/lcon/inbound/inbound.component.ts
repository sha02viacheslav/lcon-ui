import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { ApiService } from '../../api.service';
import { SummaryType } from '@enums';
import { getSummaryQuery } from '../../@core/utils';
import { BlockUIService } from 'ng-block-ui';
import { DateFilterComponent } from '../../date-filter/date-filter.component';
import { SearchItem } from '@models';
import { MultipleSearchComponent } from '../../shared/components/multiple-search/multiple-search.component';

@Component({
  selector: 'app-inbound',
  templateUrl: './inbound.component.html',
  styleUrls: ['./inbound.component.scss'],
})
export class InboundComponent implements OnInit {
  readonly SummaryType = SummaryType;
  dateFilter: { start: string; end: string };
  searchItems: SearchItem[] = [];

  chartData: ChartData;
  chartType: ChartType = 'bar';
  chartOptions: ChartOptions = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { display: false },
      },
      y: { beginAtZero: true },
    },
  };

  totalInbound: number;
  noChange: number;
  lconChange: number;
  alconChange: number;
  demarcChange: number;

  @ViewChild('dateFilterComponent') dateFilterComponent: DateFilterComponent;
  @ViewChild('multipleSearchComponent') multipleSearchComponent: MultipleSearchComponent;

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
    promises.push(
      new Promise((resolve) => {
        this.api
          .getCount({
            rawWhere: getSummaryQuery(SummaryType.TOTAL_INBOUND),
            multipleSearch: JSON.stringify(this.searchItems),
            ...this.dateFilter,
          })
          .subscribe((res) => {
            this.totalInbound = Number(res.result);
            resolve(res.result);
          });
      }),
    );
    promises.push(
      new Promise((resolve) => {
        this.api
          .getCount({
            rawWhere: getSummaryQuery(SummaryType.NO_CHANGE),
            multipleSearch: JSON.stringify(this.searchItems),
            ...this.dateFilter,
          })
          .subscribe((res) => {
            this.noChange = Number(res.result);
            resolve(res.result);
          });
      }),
    );
    promises.push(
      new Promise((resolve) => {
        this.api
          .getCount({
            rawWhere: getSummaryQuery(SummaryType.LCON_CHANGE),
            multipleSearch: JSON.stringify(this.searchItems),
            ...this.dateFilter,
          })
          .subscribe((res) => {
            this.lconChange = Number(res.result);
            resolve(res.result);
          });
      }),
    );
    promises.push(
      new Promise((resolve) => {
        this.api
          .getCount({
            rawWhere: getSummaryQuery(SummaryType.ALCON_CHANGE),
            multipleSearch: JSON.stringify(this.searchItems),
            ...this.dateFilter,
          })
          .subscribe((res) => {
            this.alconChange = Number(res.result);
            resolve(res.result);
          });
      }),
    );
    promises.push(
      new Promise((resolve) => {
        this.api
          .getCount({
            rawWhere: getSummaryQuery(SummaryType.DEMARC_CHANGE),
            multipleSearch: JSON.stringify(this.searchItems),
            ...this.dateFilter,
          })
          .subscribe((res) => {
            this.demarcChange = Number(res.result);
            resolve(res.result);
          });
      }),
    );

    Promise.all(promises).then((res) => {
      this.loadChart();
      this.blockUIService.stop('APP');
    });
  }

  private loadChart(): void {
    this.chartData = {
      labels: ['No Change', 'Primary LCON Change', 'Secondary LCON Change', 'Demarc Change'],
      datasets: [
        {
          label: 'Total',
          backgroundColor: ['#112F64', '#0D62FF', '#8BE1FA', '#A89FFF'],
          data: [this.noChange, this.lconChange, this.alconChange, this.demarcChange],
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
}
