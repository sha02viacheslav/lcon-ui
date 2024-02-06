import { Component, EventEmitter, Output } from '@angular/core';
import { AddSearchDialogData, SearchItem } from '@models';
import { DialogService } from '../../../@core/services/dialog/dialog.service';
import { AddSearchComponent } from '../add-search/add-search.component';
import { MatChipEditedEvent } from '@angular/material/chips';
import { SearchKey } from '@enums';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-multiple-search',
  templateUrl: './multiple-search.component.html',
  styleUrl: './multiple-search.component.scss',
})
export class MultipleSearchComponent {
  @Output() onChange = new EventEmitter<SearchItem[]>();
  searchItems: SearchItem[] = [{ searchKey: SearchKey.CARRIER, searchValue: 'Test Carrier' }];

  constructor(private dialogService: DialogService) {}

  addSearch() {
    const config: MatDialogConfig<AddSearchDialogData> = {
      data: { searchItems: this.searchItems },
      width: '560px',
      autoFocus: false,
    };
    this.dialogService
      .open(AddSearchComponent, config)
      .afterClosed()
      .subscribe((result: SearchItem[]) => {
        if (result) {
          this.searchItems = result;
          this.onChange.emit(this.searchItems);
        }
      });
  }

  removeSearch(index: number) {
    this.searchItems.splice(index, 1);
    this.onChange.emit(this.searchItems);
  }

  editSearch(index: number, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (value) {
      this.searchItems[index].searchValue = event.value.trim();
    } else {
      this.searchItems.splice(index, 1);
    }
    this.onChange.emit(this.searchItems);
  }

  clearSearch() {
    if (this.searchItems?.length) {
      this.searchItems = [];
      this.onChange.emit(this.searchItems);
    }
  }
}
