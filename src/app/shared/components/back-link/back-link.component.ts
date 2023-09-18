import { Location } from '@angular/common';
import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterService } from 'src/app/@core/services';

@Component({
  selector: 'app-back-link',
  templateUrl: './back-link.component.html',
  styleUrls: ['./back-link.component.scss'],
})
export class BackLinkComponent implements OnInit {
  @Input() handleBack = new EventEmitter();
  @Input() defaultBackTo: string | undefined;
  @Input() title = '';
  constructor(private location: Location, private router: Router, private routerService: RouterService) {}

  ngOnInit(): void {}

  onClick() {
    if (this.handleBack.observers.length) {
      this.handleBack.emit();
    } else if (this.routerService.hasBack) {
      this.location.back();
    } else {
      this.router.navigate([this.defaultBackTo]);
    }
  }
}
