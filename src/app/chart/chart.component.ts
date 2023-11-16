import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem, ChartData, registerables, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnChanges, OnDestroy {
  @Input() type = '' as ChartType;
  @Input() data: ChartData = { datasets: [] };
  @Input() options: ChartOptions = {} as ChartOptions;

  chart: Chart | undefined;

  ngOnChanges() {
    this.createChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  public createChart(): void {
    if (!this.data) {
      return;
    }

    if (this.chart) {
      this.chart.data = this.data;
      this.chart.update();
      return;
    }

    Chart.register(...registerables);

    const config: ChartConfiguration = {
      type: this.type,
      data: this.data,
      options: this.options,
    };

    const chartItem: ChartItem = document.getElementById('chart') as ChartItem;

    this.chart = new Chart(chartItem, config);
  }
}
