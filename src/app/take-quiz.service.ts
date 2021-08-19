import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/internal/operators";
import { environment } from 'src/environments/environment';
import { Quiz } from './models/quiz';
import { Answer } from './models/answer';
import { UserQuiz } from './models/userquiz';
import { Account } from './models/account'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TakeQuizService {
  
  constructor(private http: HttpClient) { }

  account: Account = JSON.parse(<string>sessionStorage.getItem('account'));

  addUserQuiz(userquiz: UserQuiz): Observable<UserQuiz> {
    return this.http.post<UserQuiz>(`${environment.apiUrl}/api/Users/${this.account['userId']}/Quizzes`, userquiz, httpOptions)
      .pipe(catchError(error => {
        console.log(error);
        return throwError('Encountered an error communicating with the server.');
      }));
  }  

  addQuizAnswer(answer: Answer): Observable<Quiz> {
    return this.http.post<Quiz>(`${environment.apiUrl}/api/Quizzes/${answer.userId}
    /Results`, answer, httpOptions)
      .pipe(catchError(error => {
        console.log(error);
        return throwError('Encountered an error communicating with the server.');
      }));
  }
  
  updateMaxUserQuizScore(score: number): Observable<number> {
    return this.http.put<number>(`${environment.apiUrl}/api/Users/UserQuiz/${score}`, score, httpOptions)
    .pipe(catchError(error => {
      console.log(error);
      return throwError('Encountered an error communicating with the server.');
    }));
  }
}