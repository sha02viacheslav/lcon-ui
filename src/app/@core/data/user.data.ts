import { Injectable } from '@angular/core';
import { IUser } from './interfaces/user.interface';

@Injectable({providedIn: 'root'})
/**
 * User Data Service Class
 */
export class UserDataService {
    user: IUser;

    /**
     * CONSTRUCTOR
     */
    constructor() {
        this.user = {
            ntid: '',
            email: '',
            name: '',
            title: '',
            role: '',
            groups: [],
        };
    }

    /**
     * Method  to update user data
     * @param user IUser - New user object to assign to global user reference
     */
    updateUserDetails(user: IUser) {
        this.user = user;
    }
}

