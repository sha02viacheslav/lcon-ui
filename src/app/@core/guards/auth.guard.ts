import { catchError, tap, takeUntil } from 'rxjs/operators';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, OnDestroy {
    private readonly destroy$: Subject<void> = new Subject<void>();

    constructor(private loginService: LoginService, private userService: UserService, private router: Router) { }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Observable(sub => {
            this.loginService.validateSession()
                .pipe(
                    tap((res: any) => {
                        if (res.status === 'authenticated') {
                            this.userService.user = res.user;
                            sub.next(true);
                        } else {
                            throw 'Status not authenticated'
                        }
                    }),
                    catchError(err => {
                        this.router.navigateByUrl('/login');
                        sub.next(false);
                        throw err;
                    }),
                    takeUntil(this.destroy$),
                ).subscribe(console.log);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
