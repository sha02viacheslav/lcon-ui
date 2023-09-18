import { Component, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-quarter-selector',
  templateUrl: './quarter-selector.component.html',
  styleUrls: ['./quarter-selector.component.scss'],
})
export class QuarterSelectorComponent {
  @Output() onChange = new EventEmitter<Date>();
  year = new Date().getFullYear();
  quarter: number | undefined;

  handleSelect() {
    if (this.quarter) {
      const date = new Date();
      date.setFullYear(this.year);
      date.setMonth((this.quarter - 1) * 3);
      this.onChange.next(moment(date).startOf('month').toDate());
    }
  }

  handlePreYear(event: Event) {
    event.stopPropagation();
    this.year = this.year - 1;
    this.handleSelect();
  }

  handleNextYear(event: Event) {
    event.stopPropagation();
    this.year = this.year + 1;
    this.handleSelect();
  }
}
