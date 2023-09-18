import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { RouterService } from './@core/services';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lcon';

  constructor(private routerService: RouterService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.routerService.hasBack = true;
    });
  }
}
