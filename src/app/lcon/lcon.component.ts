import { Component } from '@angular/core';
import { SearchService } from '../@core/services';

@Component({
  selector: 'app-lcon',
  templateUrl: './lcon.component.html',
  styleUrls: ['./lcon.component.scss'],
})
export class LconComponent {
  constructor(public searchService: SearchService) {}
}
