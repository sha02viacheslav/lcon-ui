import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

export enum DateRangeType {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YTD = 'YTD',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent implements OnInit {
  @Output() onChange = new EventEmitter<{ start: string; end: string }>();
  readonly DateRangeType = DateRangeType;

  DATE_RANGE_ITEMS = [
    { label: 'Custom', value: DateRangeType.CUSTOM },
    { label: 'Week', value: DateRangeType.WEEK },
    { label: 'Fiscal Month', value: DateRangeType.MONTH },
    { label: 'Fiscal Quarter', value: DateRangeType.QUARTER },
    { label: 'YTD', value: DateRangeType.YTD },
    { label: 'Yearly', value: DateRangeType.YEARLY },
  ];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    type: new FormControl<DateRangeType | null>(null),
  });
  type: DateRangeType = DateRangeType.CUSTOM;

  ngOnInit() {
    this.range.valueChanges.subscribe(() => {
      const { start, end } = this.range.value;
      if (this.range.valid && start && end) {
        this.onChange.next({
          start: moment(start).format('YYYY-MM-DD'),
          end: moment(end).format('YYYY-MM-DD'),
        });
      }
    });
  }

  handleChangeDateRangeType(value: DateRangeType) {
    switch (value) {
      case DateRangeType.YTD: {
        this.range.patchValue({ start: moment().startOf('year').toDate(), end: new Date() });
        this.range.controls['start'].disable();
        this.range.controls['end'].disable();
        break;
      }
      default: {
        this.range.patchValue({ start: null, end: null });
        this.range.controls['start'].enable();
        this.range.controls['end'].enable();
      }
    }
  }

  handleChangeDate(value: Date) {
    switch (this.type) {
      case DateRangeType.WEEK: {
        this.range.patchValue({
          start: moment(value).startOf('week').toDate(),
          end: moment(value).endOf('week').toDate(),
        });
        break;
      }
      case DateRangeType.MONTH: {
        this.range.patchValue({
          start: moment(value).startOf('month').toDate(),
          end: moment(value).endOf('month').toDate(),
        });
        break;
      }
      case DateRangeType.QUARTER: {
        this.range.patchValue({
          start: moment(value).startOf('month').toDate(),
          end: moment(value).add(2, 'months').endOf('month').toDate(),
        });
        break;
      }
      case DateRangeType.YEARLY: {
        this.range.patchValue({
          start: moment(value).startOf('year').toDate(),
          end: moment(value).endOf('year').toDate(),
        });
        break;
      }
    }
  }
}
