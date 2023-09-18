import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private loginService: LoginService, private userService: UserService, private router: Router) { }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Observable(sub => {
            this.loginService.validateSession().subscribe(
                (res: any) => {
                    console.log(res);
                    if (res.status === 'authenticated') {
                        this.userService.user = res.user;
                        sub.next(true);
                    } else {
                        this.router.navigateByUrl('/login');
                        sub.next(false);
                    }
                },
                (error: any) => {
                    console.log(error);
                    this.router.navigateByUrl('/login');
                    sub.next(false);
                },
            );
        });
    }
}
