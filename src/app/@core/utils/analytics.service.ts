import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServerDetails } from '../config.core';

declare const ga: any;

@Injectable()
export class AnalyticsService {
  private enabled: boolean;
  private apiVersion = 'v1';

  constructor(private location: Location, private router: Router, private http: HttpClient) {
    this.enabled = ServerDetails.analytics;
  }

  trackPageViews() {
    if (this.enabled) {
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
      )
        .subscribe(() => {
          const params: HttpParams = new HttpParams()
            .set('hitType', 'pageview')
            .set('page', this.location.path().split('/')[this.location.path().split('/').length - 1]);
          this.http.post<any>(`${ServerDetails.baseUrl}/${this.apiVersion}/analyitics/page-views`, params).subscribe();
        });
    }
  }

  trackEvent(eventName: string) {
    if (this.enabled) {
      const params: HttpParams = new HttpParams()
        .set('event', eventName)
        .set('page', this.location.path().split('/')[this.location.path().split('/').length - 1]);
      this.http.post<any>(`${ServerDetails.baseUrl}/${this.apiVersion}/analyitics/events`, params).subscribe();
    }
  }
}
