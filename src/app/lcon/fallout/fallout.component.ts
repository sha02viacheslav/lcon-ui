import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { Lcon } from '@models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, merge } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { getSummaryQuery, sanitizeData } from '../../@core/utils';
import * as XLSX from 'xlsx';
import * as moment from 'moment/moment';
import { ToastrService } from 'ngx-toastr';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { SummaryType } from '@enums';

@Component({
  selector: 'app-fallout',
  templateUrl: './fallout.component.html',
  styleUrls: ['./fallout.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FalloutComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['enddate', 'orderacceptancedate', 'sr', 'serviceorderid'];
  columnsToDisplayWithExpand: string[] = [...this.displayedColumns, 'expand'];
  expandedElement: Lcon | null;
  dataSource: MatTableDataSource<Lcon>;
  totalCnt: number;
  isLoading = true;
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
  totalAttempted: number;
  totalSuccessful: number;
  totalFailed: number;
  search: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private toastr: ToastrService) {}

  ngOnInit() {
    this.getLconList();

    this.loadData();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(debounceTime(400))
      .subscribe(() => {
        this.getLconList();
      });
  }

  private async loadData() {
    await this.apiService.getCount(getSummaryQuery(SummaryType.TOTAL_OUTBOUND)).then((res) => {
      this.totalAttempted = Number(res.data);
    });
    await this.apiService.getCount(getSummaryQuery(SummaryType.TOTAL_SUCCESSFUL)).then((res) => {
      this.totalSuccessful = Number(res.data);
    });
    await this.apiService.getCount(getSummaryQuery(SummaryType.TOTAL_FAILED)).then((res) => {
      this.totalFailed = Number(res.data);
    });

    this.loadChart();
  }

  private loadChart(): void {
    this.chartData = {
      labels: ['Attempted', 'Successful', 'Failed'],
      datasets: [
        {
          label: 'Total',
          backgroundColor: ['#112F64', '#0D62FF', '#8BE1FA'],
          data: [this.totalAttempted, this.totalSuccessful, this.totalFailed],
        },
      ],
    };
  }

  private getLconList() {
    this.isLoading = true;
    this.apiService
      .getLconList({
        search: this.search || '',
        pageIndex: this.paginator?.pageIndex || 1,
        pageSize: this.paginator?.pageSize || 10,
        sort: this.sort?.active || 'enddate',
        order: this.sort?.direction || 'desc',
        ...this.dateFilter,
        rawWhere: "status = 'Fallout'",
      })
      .subscribe(
        (res) => {
          this.isLoading = false;
          if (!res.success) {
            this.snackBar.open(res.message?.[0] || '', 'Dismiss', { duration: 4000 });
            return;
          }
          this.dataSource = new MatTableDataSource(res.result.data || []);
          this.totalCnt = res.result.totalCount;
        },
        (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.snackBar.open(err.message || '', 'Dismiss', { duration: 4000 });
        },
      );
  }

  handleChangeDateFilter(value: { start: string; end: string }) {
    this.dateFilter = value;
    this.getLconList();
  }

  exportXls() {
    this.isLoading = true;
    this.apiService
      .getLconList({
        search: this.search || '',
        sort: this.sort?.active || 'enddate',
        order: this.sort?.direction || 'desc',
        ...this.dateFilter,
        rawWhere: "status = 'Fallout'",
      })
      .subscribe(
        (res) => {
          this.isLoading = false;
          if (!res.success) {
            this.snackBar.open(res.message?.[0] || '', 'Dismiss', { duration: 4000 });
            return;
          }

          if (!res.result.data?.length) {
            this.toastr.error('No data to export');
            return;
          }

          const dataToExport = res.result.data.map((rawData) => {
            return {
              'Fallout Date': moment(rawData.enddate)?.format('MM/DD/YYYY'),
              'Order Created': moment(rawData.orderacceptancedate)?.format('MM/DD/YYYY'),
              'Century SR': rawData.sr,
              'Century Service ID': rawData.serviceorderid,
              Customer: rawData.carrier,
              'Site Address': `${rawData.address}, ${rawData.city}, ${rawData.state} ${rawData.zip}`,
              'LCON Name': `${rawData.lconfirstname} ${rawData.lconlastname}`,
              'LCON Email': rawData.lconemail,
              'LCON Phone': rawData.lconphone,
              'ALCON Name': `${rawData.alconfirstname} ${rawData.alconlastname}`,
              'ALCON Email': rawData.alconemail,
              'ALCON Phone': rawData.alconphone,
            };
          });

          const sanitizedData = sanitizeData(dataToExport);

          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(sanitizedData);
          XLSX.utils.book_append_sheet(wb, ws, 'Blank');
          XLSX.writeFile(wb, `fallout.xlsx`);
        },
        (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.snackBar.open(err.message || '', 'Dismiss', { duration: 4000 });
        },
      );
  }

  handleChangeSearch(value: string) {
    this.search = value;
    this.getLconList();
  }
}
