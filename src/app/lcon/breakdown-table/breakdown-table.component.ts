import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breakdown-table',
  templateUrl: './breakdown-table.component.html',
  styleUrls: ['./breakdown-table.component.scss'],
})
export class BreakdownTableComponent {
  @Input() title: string;
  @Input() dateHeader: string;
  @Input() dateFormat: string;
  @Input() data: any[] = [];
  weeklyDisplayedColumns: string[] = [
    'date',
    'firstOutbound',
    'secondOutbound',
    'totalOutbound',
    'firstInbound',
    'secondInbound',
    'totalInbound',
    'invalid',
    'noResponse',
    'totalUnreachable',
  ];
}
