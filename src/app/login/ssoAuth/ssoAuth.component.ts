import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../@core/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
//import { UserService } from '../../@core/services/user.service';

@Component({
  selector: 'ngx-ssoAuth-component',
  templateUrl: './ssoAuth.component.html',
  styleUrls: ['./ssoAuth.component.scss'],
})
export class SsoAuthComponent implements OnInit, OnDestroy {
  isAuthenticating = false;
  currentTheme: string;
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    private authService: LoginService,
    //private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.onSsoAuth();
  }

  onSsoAuth() {
    this.isAuthenticating = true;

    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.authService.ssoAuth(code)
        .pipe(
          tap(() => {
            this.isAuthenticating = false;
            this.router.navigate(['']);
          }),
          catchError(err => {
            throw err;
          }),
          takeUntil(this.destroy$),
        ).subscribe(console.log);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
