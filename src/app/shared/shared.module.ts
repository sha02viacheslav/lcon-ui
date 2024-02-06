import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackLinkComponent } from './components/back-link/back-link.component';
import { MatIconModule } from '@angular/material/icon';
import { ConvertDatePipe } from './pipes/convert-date/convert-date.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SearchComponent } from './components/search/search.component';
import { MatButtonModule } from '@angular/material/button';
import { MultipleSearchComponent } from './components/multiple-search/multiple-search.component';
import { AddSearchComponent } from './components/add-search/add-search.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { SearchLabelPipe } from './pipes/search-label/search-label.pipe';

const MAT_MODULES = [
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatButtonToggleModule,
  MatButtonModule,
  MatDialogModule,
  MatSelectModule,
];

const COMPONENTS = [BackLinkComponent, SearchComponent, MultipleSearchComponent, AddSearchComponent];

const PIPES = [ConvertDatePipe, SearchLabelPipe];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    ...MAT_MODULES,
    MatChipsModule,
  ],
  exports: [FormsModule, ReactiveFormsModule, RouterModule, FlexLayoutModule, ...MAT_MODULES, ...COMPONENTS, ...PIPES],
})
export class SharedModule {}
