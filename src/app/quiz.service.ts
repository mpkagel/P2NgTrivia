import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/internal/operators";
import { Account } from "./models/account";
import { Quiz } from './models/quiz';
import { environment } from 'src/environments/environment';
import { UserQuiz } from './models/userquiz';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(private http: HttpClient) { }

  randomQuiz: Quiz = new Quiz();

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${environment.apiUrl}/api/Quizzes`, { withCredentials: true })
      .pipe(catchError(error => {
        console.log('error:');
        console.log(error);
        // could inspect the error for what sort it is
        // (4xx status code, 5xx status code, httpclient failure itself)
        return throwError('Encountered an error communicating with the server.');
      }));
  }

  getRandomQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(`${environment.apiUrl}/api/Quizzes/Random`, quiz, httpOptions)
      .pipe(catchError(error => {
        console.log('error:');
        console.log(error);
        // could inspect the error for what sort it is
        // (4xx status code, 5xx status code, httpclient failure itself)
        return throwError('Encountered an error communicating with the server.');
      }));
  }

  getUserQuizzes(user: Account): Observable<UserQuiz[]> {
    return this.http.get<UserQuiz[]>(`${environment.apiUrl}/api/Users/${user.userId}/Quizzes?userId=${user.userId}`)
    .pipe(catchError(error => {
      console.log('error:');
      console.log(error);
      // could inspect the error for what sort it is
      // (4xx status code, 5xx status code, httpclient failure itself)
      return throwError('Encountered an error communicating with the server.');
    }));
  }

}
