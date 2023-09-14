import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { ApiService } from '../../api.service';
import { SummaryType } from '../../@core/enums';
import { getSummaryQuery } from '../../@core/utils';

@Component({
  selector: 'app-inbound',
  templateUrl: './inbound.component.html',
  styleUrls: ['./inbound.component.scss'],
})
export class InboundComponent implements OnInit {
  readonly SummaryType = SummaryType;
  isLoading: boolean = true;
  dateFilter: { start: string; end: string };

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

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData() {
    this.isLoading = true;
    const promises = [];
    promises.push(
      new Promise((resolve) => {
        this.api
          .getCount({ rawWhere: getSummaryQuery(SummaryType.TOTAL_INBOUND), ...this.dateFilter })
          .subscribe((res) => {
            this.totalInbound = Number(res.result);
            resolve(res.result);
          });
      }),
    );
    promises.push(
      new Promise((resolve) => {
        this.api.getCount({ rawWhere: getSummaryQuery(SummaryType.NO_CHANGE), ...this.dateFilter }).subscribe((res) => {
          this.noChange = Number(res.result);
          resolve(res.result);
        });
      }),
    );
    promises.push(
      new Promise((resolve) => {
        this.api
          .getCount({ rawWhere: getSummaryQuery(SummaryType.LCON_CHANGE), ...this.dateFilter })
          .subscribe((res) => {
            this.lconChange = Number(res.result);
            resolve(res.result);
          });
      }),
    );
    promises.push(
      new Promise((resolve) => {
        this.api
          .getCount({ rawWhere: getSummaryQuery(SummaryType.ALCON_CHANGE), ...this.dateFilter })
          .subscribe((res) => {
            this.alconChange = Number(res.result);
            resolve(res.result);
          });
      }),
    );
    promises.push(
      new Promise((resolve) => {
        this.api
          .getCount({ rawWhere: getSummaryQuery(SummaryType.DEMARC_CHANGE), ...this.dateFilter })
          .subscribe((res) => {
            this.demarcChange = Number(res.result);
            resolve(res.result);
          });
      }),
    );

    Promise.all(promises).then((res) => {
      this.loadChart();
      this.isLoading = false;
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
}
