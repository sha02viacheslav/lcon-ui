import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddSearchDialogData, SearchItem } from '@models';
import { DialogService } from '../../../@core/services/dialog/dialog.service';
import { AddSearchComponent } from '../add-search/add-search.component';
import { MatChipEditedEvent } from '@angular/material/chips';
import { MatDialogConfig } from '@angular/material/dialog';
import { SearchService } from '../../../@core/services';

@Component({
  selector: 'app-multiple-search',
  templateUrl: './multiple-search.component.html',
  styleUrl: './multiple-search.component.scss',
})
export class MultipleSearchComponent {
  @Input() searchItems: SearchItem[] = [];
  @Output() onChange = new EventEmitter<SearchItem[]>();

  constructor(
    private dialogService: DialogService,
    private searchService: SearchService,
  ) {}

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
          this.handleChangeSearchItems();
        }
      });
  }

  removeSearch(index: number) {
    this.searchItems.splice(index, 1);
    this.handleChangeSearchItems();
  }

  editSearch(index: number, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (value) {
      this.searchItems[index].searchValue = event.value.trim();
    } else {
      this.searchItems.splice(index, 1);
    }
    this.handleChangeSearchItems();
  }

  clearSearch() {
    if (this.searchItems?.length) {
      this.searchItems = [];
      this.handleChangeSearchItems();
    }
  }

  private handleChangeSearchItems() {
    this.onChange.emit(this.searchItems);
    this.searchService.setSearchItems(this.searchItems);
  }
}
