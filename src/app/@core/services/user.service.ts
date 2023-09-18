import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserData } from '../data/abstracts/user-data.abstract';
import { HttpClient } from '@angular/common/http';
import { ServerDetails } from '../config.core';
@Injectable({providedIn: 'root'})
export class UserService extends UserData {
    user: any;
    usersSubject: Subject<any> = new Subject();
    roleSubject: Subject<any> = new Subject();
    apiVersion: string;

    constructor(private http: HttpClient) {
        super();
        this.apiVersion = 'v1';
    }

    getUser(): Observable<any> {
        return this.http.get(`${ServerDetails.baseUrl}/auth/session`, {withCredentials: true});
    }


    getUsers() {
        this.http.get(`${ServerDetails.baseUrl}/users`, {withCredentials: true}).subscribe((users: any) => {
            this.usersSubject.next(users.data);
        });
    }

    getUsersByRole(role: string) {
        this.http.get(`${ServerDetails.baseUrl}/users?role=${role}`, {withCredentials: true}).subscribe((users: any) => {
            this.roleSubject.next(users.data);
        });
    }

    addUser(form: any): Observable<any> {
        const {ntid, email, name, title, role, groups, emailAlerts} = form;
        const createData = {
            ntid, email, name, title, role, groups, emailAlerts
        };
        return this.http.post(`${ServerDetails.baseUrl}/users`, createData, {withCredentials: true});
    }

    updateUser(form: any): Observable<any> {
        const {ntid, email, name, title, role, groups, emailAlerts} = form;
        const updateData = {
            ntid, email, name, title, role, groups, emailAlerts
        };
        return this.http.put(`${ServerDetails.baseUrl}/users`, updateData, {withCredentials: true});
    }

    deleteUser(ntid: string): Observable<any> {
        return this.http.delete(`${ServerDetails.baseUrl}/users?ntid=${ntid}`, {withCredentials: true});
    }
}