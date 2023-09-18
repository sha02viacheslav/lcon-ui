import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import {
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerInputEvent,
  MatDateRangeSelectionStrategy,
} from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';

@Injectable()
export class FiveDayRangeSelectionStrategy implements MatDateRangeSelectionStrategy<string> {
  constructor(private _dateAdapter: DateAdapter<string>) {}

  selectionFinished(date: string | null): DateRange<string> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: string | null): DateRange<string> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: string | null): DateRange<any> {
    if (date) {
      const d = moment(date);
      const start = d.startOf('week').toDate();
      const end = d.endOf('week').toDate();
      return new DateRange<any>(start, end);
    }

    return new DateRange<string>(null, null);
  }
}

@Component({
  selector: 'app-week-selector',
  templateUrl: './week-selector.component.html',
  styleUrls: ['./week-selector.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: FiveDayRangeSelectionStrategy,
    },
  ],
})
export class WeekSelectorComponent {
  @Output() onChange = new EventEmitter<Date>();
  constructor() {}

  handleSelect(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    if (date) this.onChange.emit(date);
  }
}
