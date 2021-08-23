import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { Quiz } from '../models/quiz';
import { Question } from '../models/question';
import { QuestionsService } from '../questions.service';
import { UserQuiz } from '../models/userquiz';
import { Account } from '../models/account';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})

export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];
  questions: Question[] = [];
  randomQuiz: Quiz = new Quiz();
  userQuizzes: UserQuiz[] = [];
  user: Account = {userId: -1, username: "", roles: []};
   constructor(private quizService: QuizService, private questionsService: QuestionsService) { }

  ngOnInit() {
    this.quizService.getQuizzes().subscribe(data => {
      this.quizzes = data;
    }, err => console.log(err));
    if (sessionStorage.getItem('account') !== null) {
      this.user = JSON.parse(<string>sessionStorage.getItem('account'));
    }
  }

  getQuestions(quiz : Quiz) { this.questionsService.getQuestions(quiz).subscribe(data => {
    this.questions = data;
  }, err => console.log(err));}

  getUserQuizzes(user: Account) {
      this.quizService.getUserQuizzes(user).subscribe(data => {
      this.userQuizzes = data;
    }, err => console.log(err));
  } 
}