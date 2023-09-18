import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { ApiService } from '../../api.service';
import { SummaryType } from '@enums';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  readonly SummaryType = SummaryType;
  isLoading: boolean = true;
  weeklyDisplayedColumns: string[] = ['date', 'firstOutboundCount', 'secondOutboundCount', 'totalOutboundCount', 'firstInboundCount', 'secondInboundCount', 'totalInboundCount', 'invalidCount', 'noResponseCount', 'totalUnreachableCount',]
  weeklyTotals = [];
  
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
    .set(this.keys.get(0), "firstnotificationdate != '' AND secondnotificationdate = ''")
    .set(this.keys.get(1), "secondnotificationdate != ''")
    .set(this.keys.get(2), "firstnotificationdate != '' AND secondnotificationdate = '' AND emailresponsedate !=''")
    .set(this.keys.get(3), "secondnotificationdate != '' AND emailresponsedate !=''")
    .set(this.keys.get(4), "status = 'Skipped'")
    .set(this.keys.get(5), "emailresponsedate = '' AND status != 'Skipped' AND status != 'Completed'");

  queries = new Map<string, number>();

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
}
