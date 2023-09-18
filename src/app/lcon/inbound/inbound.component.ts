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
    await this.api.getCount(getSummaryQuery(SummaryType.TOTAL_INBOUND)).then((res) => {
      this.totalInbound = Number(res.data);
    });
    await this.api.getCount(getSummaryQuery(SummaryType.NO_CHANGE)).then((res) => {
      this.noChange = Number(res.data);
    });
    await this.api.getCount(getSummaryQuery(SummaryType.LCON_CHANGE)).then((res) => {
      this.lconChange = Number(res.data);
    });
    await this.api.getCount(getSummaryQuery(SummaryType.ALCON_CHANGE)).then((res) => {
      this.alconChange = Number(res.data);
    });
    await this.api.getCount(getSummaryQuery(SummaryType.DEMARC_CHANGE)).then((res) => {
      this.demarcChange = Number(res.data);
    });
    this.loadChart();
    this.isLoading = false;
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
    console.log('Change Date Filter', value);
  }
}
