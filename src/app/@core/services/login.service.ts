import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { ServerDetails } from '../config.core';
import { DOCUMENT } from '@angular/common';


@Injectable({ providedIn: 'root' })

export class LoginService {
    sessionSubject: Subject<any> = new Subject();
    private apiVersion = 'v1';

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(DOCUMENT) private document: Document,
    ) { }

    login(formData: any): Observable<any> {
        const params: HttpParams = new HttpParams()
            .set('username', formData.username)
            .set('password', formData.password);
        return this.http.post<any>(`${ServerDetails.baseUrl}/auth/login`, params, ServerDetails.routerConfig);
    }

    ssoAuth(code: string) {
        return this.http.get(`${ServerDetails.baseUrl}/auth/sso?code=${code}`, { withCredentials: true });
    }

    validateSession() {
        return this.http.get(`${ServerDetails.baseUrl}/auth/session`, ServerDetails.routerConfig);
    }

    logout() {
        this.http.get<any>(`${ServerDetails.baseUrl}/auth/logout`, ServerDetails.routerConfig).subscribe(
            (res: any) => {
                this.router.navigateByUrl('/login');
            },
            (err: any) => { },
        );
    }
}
