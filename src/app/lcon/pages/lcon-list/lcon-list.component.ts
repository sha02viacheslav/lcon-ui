import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { SummaryType } from '@enums';
import { Lcon } from '@models';
import { debounceTime, merge } from 'rxjs';
import { getSummaryQuery, sanitizeData } from 'src/app/@core/utils';
import { ApiService } from 'src/app/api.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BlockUIService } from 'ng-block-ui';
import { DateFilterComponent } from '../../../date-filter/date-filter.component';
import { SearchComponent } from '../../../shared/components/search/search.component';

@Component({
  selector: 'app-lcon-list',
  templateUrl: './lcon-list.component.html',
  styleUrls: ['./lcon-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LconListComponent implements AfterViewInit {
  readonly SummaryType = SummaryType;
  summaryType: SummaryType;
  displayedColumns: string[] = [
    'sr',
    'serviceorderid',
    'carrier',
    'status',
    'firstnotificationdate',
    'secondnotificationdate',
    'thirdnotificationdate',
  ];
  columnsToDisplayWithExpand: string[] = ['expand', ...this.displayedColumns];
  expandedElement: Lcon | null;
  dataSource: MatTableDataSource<Lcon>;
  totalCnt: number;
  dateFilter: { start: string; end: string };
  typeOptions: { value: SummaryType; label: string }[] = [];
  search = '';

  titles: { [key: string]: string } = {
    [SummaryType.TOTAL_OUTBOUND]: 'Outbound Details - All',
    [SummaryType.FIRST_OUTBOUND]: 'Outbound Details - 1st Notification',
    [SummaryType.SECOND_OUTBOUND]: 'Outbound Details - 2nd Notification',
    [SummaryType.TOTAL_INBOUND]: 'Inbound Details - All',
    [SummaryType.FIRST_INBOUND]: 'Inbound Details - Response to 1st Email',
    [SummaryType.SECOND_INBOUND]: 'Inbound Details - Response to 2nd Email',
    [SummaryType.TOTAL_UNREACHABLE]: 'Unreachable Details - All',
    [SummaryType.INVALID]: 'Unreachable Details - Invalid Email',
    [SummaryType.NO_RESPONSE]: 'Unreachable Details - No Response',
    [SummaryType.NO_CHANGE]: 'Inbound Responses - No Change',
    [SummaryType.LCON_CHANGE]: 'Inbound Responses - LCON Change',
    [SummaryType.ALCON_CHANGE]: 'Inbound Responses - ALCON Change',
    [SummaryType.DEMARC_CHANGE]: 'Inbound Responses - Demarc Change',
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('dateFilterComponent') dateFilterComponent: DateFilterComponent;
  @ViewChild('searchComponent') searchComponent: SearchComponent;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private blockUIService: BlockUIService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.has('summaryType')) {
        const summaryType = params.get('summaryType');
        if (summaryType) {
          this.summaryType = summaryType as SummaryType;
          this.getLconList();
          switch (this.summaryType) {
            case SummaryType.TOTAL_OUTBOUND:
            case SummaryType.FIRST_OUTBOUND:
            case SummaryType.SECOND_OUTBOUND: {
              this.typeOptions = [
                { value: SummaryType.TOTAL_OUTBOUND, label: 'All' },
                { value: SummaryType.FIRST_OUTBOUND, label: '1st Notification' },
                { value: SummaryType.SECOND_OUTBOUND, label: '2nd Notification' },
              ];
              break;
            }
            case SummaryType.TOTAL_INBOUND:
            case SummaryType.FIRST_INBOUND:
            case SummaryType.SECOND_INBOUND: {
              this.typeOptions = [
                { value: SummaryType.TOTAL_INBOUND, label: 'All' },
                { value: SummaryType.FIRST_INBOUND, label: '1st Notification' },
                { value: SummaryType.SECOND_INBOUND, label: '2nd Notification' },
              ];
              break;
            }
            case SummaryType.TOTAL_UNREACHABLE:
            case SummaryType.INVALID:
            case SummaryType.NO_RESPONSE: {
              this.typeOptions = [
                { value: SummaryType.TOTAL_UNREACHABLE, label: 'All' },
                { value: SummaryType.INVALID, label: 'Invalid' },
                { value: SummaryType.NO_RESPONSE, label: 'No Response' },
              ];
              break;
            }
            case SummaryType.NO_CHANGE:
            case SummaryType.LCON_CHANGE:
            case SummaryType.ALCON_CHANGE:
            case SummaryType.DEMARC_CHANGE: {
              this.typeOptions = [
                { value: SummaryType.NO_CHANGE, label: 'No Change' },
                { value: SummaryType.LCON_CHANGE, label: 'LCON Change' },
                { value: SummaryType.ALCON_CHANGE, label: 'ALCON Change' },
                { value: SummaryType.DEMARC_CHANGE, label: 'Demarc Change' },
              ];
              break;
            }
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(debounceTime(400))
      .subscribe(() => {
        this.getLconList();
      });
  }

  handleChangeDateFilter(value: { start: string; end: string }) {
    this.dateFilter = value;
    this.getLconList();
  }

  handleChangeType(event: MatButtonToggleChange) {
    this.getLconList();
  }

  handleChangeSearch(value: string) {
    this.search = value;
    this.getLconList();
  }

  clearFilters() {
    this.dateFilterComponent.clear();
    this.dateFilter = null;
    if (this.search) {
      // Clear search will run getLconList()
      this.searchComponent.clearSearch();
    } else {
      this.getLconList();
    }
  }

  private getLconList() {
    this.blockUIService.start('APP', `Loading...`);
    this.apiService
      .getLconList({
        search: this.search || '',
        pageIndex: this.paginator?.pageIndex || 1,
        pageSize: this.paginator?.pageSize || 10,
        sort: this.sort?.active || 'enddate',
        order: this.sort?.direction || 'desc',
        ...this.dateFilter,
        rawWhere: getSummaryQuery(this.summaryType),
      })
      .subscribe(
        (res) => {
          this.blockUIService.stop('APP');
          if (!res.success) {
            this.snackBar.open(res.message?.[0] || '', 'Dismiss', { duration: 4000 });
            return;
          }
          this.dataSource = new MatTableDataSource(res.result.data || []);
          this.totalCnt = res.result.totalCount;
        },
        (err: HttpErrorResponse) => {
          this.blockUIService.stop('APP');
          this.snackBar.open(err.message || '', 'Dismiss', { duration: 4000 });
        },
      );
  }

  exportXls() {
    this.blockUIService.start('APP', `Loading...`);
    this.apiService
      .getLconList({
        search: this.search || '',
        sort: this.sort?.active || 'enddate',
        order: this.sort?.direction || 'desc',
        ...this.dateFilter,
        rawWhere: getSummaryQuery(this.summaryType),
      })
      .subscribe(
        (res) => {
          this.blockUIService.stop('APP');
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
              'Century SR': rawData.sr,
              'Century Service ID': rawData.serviceorderid,
              Customer: rawData.carrier,
              'LCON Name': `${rawData.lconfirstname} ${rawData.lconlastname}`,
              'LCON Email': rawData.lconemail,
              'LCON Phone': rawData.lconphone,
              'ALCON Name': `${rawData.alconfirstname} ${rawData.alconlastname}`,
              'ALCON Email': rawData.alconemail,
              'ALCON Phone': rawData.alconphone,
              'Project Manager': rawData.projectmanager,
              MDR: rawData.mdr,
              PON: rawData.pon,
              'Site Name': rawData.sitename,
              'Site Address': `${rawData.address}, ${rawData.city}, ${rawData.state} ${rawData.zip}`,
              'Building Classification': rawData.buildingclassification,
              'Transport Type': rawData.transporttype,
              'Order Acceptance': moment(rawData.orderacceptancedate)?.format('MM/DD/YYYY'),
              'First Notification': moment(rawData.firstnotificationdate)?.format('MM/DD/YYYY'),
              'Second Notification': moment(rawData.secondnotificationdate)?.format('MM/DD/YYYY'),
              'Third Notification': moment(rawData.thirdnotificationdate)?.format('MM/DD/YYYY'),
              'Response Date': moment(rawData.emailresponsedate)?.format('MM/DD/YYYY'),
              Status: rawData.status,
              Result: rawData.result,
              'Response Title': rawData.responsetitle,
              Notes: rawData.notes,
              'Century Update': rawData.centuryupdate,
              Action: rawData.action,
              'Exception Message': rawData.exceptionmessage,
              'CPM Email Update': rawData.cpmemailupdate,
            };
          });

          const sanitizedData = sanitizeData(dataToExport);

          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(sanitizedData);
          XLSX.utils.book_append_sheet(wb, ws, 'Blank');
          XLSX.writeFile(wb, `${this.titles[this.summaryType]}.xlsx`);
        },
        (err: HttpErrorResponse) => {
          this.blockUIService.stop('APP');
          this.snackBar.open(err.message || '', 'Dismiss', { duration: 4000 });
        },
      );
  }
}
