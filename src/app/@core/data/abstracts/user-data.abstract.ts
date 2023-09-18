import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';

export abstract class UserData {
    abstract getUser(): Observable<IUser[]>;
}
