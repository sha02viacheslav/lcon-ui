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

const MAT_MODULES = [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonToggleModule, MatButtonModule];

const COMPONENTS = [BackLinkComponent, SearchComponent];

const PIPES = [ConvertDatePipe];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, FlexLayoutModule, ...MAT_MODULES],
  exports: [FormsModule, ReactiveFormsModule, RouterModule, FlexLayoutModule, ...MAT_MODULES, ...COMPONENTS, ...PIPES],
})
export class SharedModule {}
