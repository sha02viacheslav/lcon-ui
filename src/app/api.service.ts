import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiResponse, Filter, Lcon, Pagination } from '@models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  prodUrl = 'https://lcon-dashboard-api.as-g7.cf.comcast.net';
  apiUrl = environment.production ? this.prodUrl : 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /* CRUD functions */

  // HttpClient API get() method => fetch count based on given where clause
  getCount(filter: Filter): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/lcon/postgrescount', {
      withCredentials: true,
      params: { ...filter },
    });
  }

  getPastWeekSummary(where: string): Promise<any> {
    return this.http
      .get(this.apiUrl + '/lcon/past_week_summary', { withCredentials: true, params: { query: where } })
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  getPastYearSummary(where: string): Promise<any> {
    return this.http
      .get(this.apiUrl + '/lcon/past_year_summary', { withCredentials: true, params: { query: where } })
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  getLconList(filter: Filter): Observable<ApiResponse<Pagination<Lcon>>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/lcon/postgresdata', {
      withCredentials: true,
      params: { ...filter },
    });
  }

  getLcon(id: number): Observable<ApiResponse<Lcon>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/lcon/${id}`, { withCredentials: true });
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
