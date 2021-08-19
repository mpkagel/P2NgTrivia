import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Result } from './models/result';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from "rxjs/internal/operators";
import 'zone.js/dist/zone-error';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })

export class ResultsService {
  public API = 'https://localhost:44338/api';

  constructor(private http: HttpClient) { }
  
  questionResult: Result = new Result();

  sendResult(result: Result): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/api/Results`, result, httpOptions)
    .pipe(catchError(error => {
      console.log(error);
      return throwError('Encountered an error communicating with the server.');
    }));;
  }
}
