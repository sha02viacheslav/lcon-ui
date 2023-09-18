import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Output() onChange: EventEmitter<string> = new EventEmitter<string>();
  search: string = '';
  searchInput$: Subject<string> = new Subject<string>();

  ngOnInit() {
    this.searchInput$.pipe(debounceTime(600)).subscribe(() => {
      this.onChange.emit(this.search);
    });
  }

  clearSearch() {
    if (this.search) {
      this.search = '';
      this.searchInput$.next('');
    }
  }
}
