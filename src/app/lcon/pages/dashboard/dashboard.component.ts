import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  tabs = [
    { link: '/summary', label: 'Summary' },
    { link: '/inbound', label: 'Inbound' },
    { link: '/outbound', label: 'Outbound' },
    { link: '/fallout', label: 'Fallout' },
  ];
  activeLink: string;

  constructor(
    private location: Location,
    private router: Router,
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateActiveLinkState();
    });
    this.updateActiveLinkState();
  }

  updateActiveLinkState() {
    const activeLinkIndex = this.tabs.findIndex((item) => this.location.path().includes(item.link));
    if (activeLinkIndex > -1) {
      this.activeLink = this.tabs[activeLinkIndex].link;
    }
  }
}
