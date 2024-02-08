import { Injectable } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { SearchItem } from '@models';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  showSearchResult = false;
  search = '';
  searchInput$: Subject<string> = new Subject<string>();

  private searchItems: SearchItem[] = [];

  constructor() {
    this.searchInput$.pipe(debounceTime(600)).subscribe(() => {
      if (this.search) {
        this.openSearchPanel();
      } else {
        this.closeSearchPanel();
      }
    });
  }

  clearSearch() {
    if (this.search) {
      this.search = '';
      this.searchInput$.next('');
    }
  }

  openSearchPanel() {
    if (!this.showSearchResult) {
      this.showSearchResult = true;
      window.scrollTo(0, 0);
    }
  }

  closeSearchPanel() {
    this.search = '';
    this.showSearchResult = false;
    window.scrollTo(0, 0);
  }

  setSearchItems(items: SearchItem[]) {
    this.searchItems = items;
  }

  getSearchItems() {
    return this.searchItems;
  }
}
