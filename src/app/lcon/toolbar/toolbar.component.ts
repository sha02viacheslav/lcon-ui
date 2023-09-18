import { Component } from '@angular/core';
import { SearchService } from '../../@core/services';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(public searchService: SearchService) {}
}
