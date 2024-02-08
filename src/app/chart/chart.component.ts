import { Component, Input, OnChanges, SimpleChanges, OnDestroy, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem, ChartData, registerables, ChartType, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const customCanvasBackgroundColorPlugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#fff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() type = '' as ChartType;
  @Input() data: ChartData = { datasets: [] };
  @Input() options: ChartOptions = {} as ChartOptions;

  chart: Chart | undefined;

  ngOnInit() {}

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

    Chart.register(...registerables, ChartDataLabels, customCanvasBackgroundColorPlugin);

    const config: ChartConfiguration = {
      type: this.type,
      data: this.data,
      options: this.options,
    };

    const chartItem: ChartItem = document.getElementById('chart') as ChartItem;

    this.chart = new Chart(chartItem, config);
  }

  saveChart(fileName: string) {
    const url = this.chart.toBase64Image('image/jpeg', 1);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
