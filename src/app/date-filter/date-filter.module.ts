import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFilterComponent } from './date-filter.component';
import { MonthSelectorComponent } from './selectors/month-selector/month-selector.component';
import { YearSelectorComponent } from './selectors/year-selector/year-selector.component';
import { WeekSelectorComponent } from './selectors/week-selector/week-selector.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuarterSelectorComponent } from './selectors/quarter-selector/quarter-selector.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DateFilterComponent,
    MonthSelectorComponent,
    YearSelectorComponent,
    WeekSelectorComponent,
    QuarterSelectorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [DateFilterComponent],
})
export class DateFilterModule {}
