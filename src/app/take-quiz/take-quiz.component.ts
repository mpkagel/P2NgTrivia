import { Component, OnInit } from '@angular/core';
import { Quiz } from '../models/quiz';
import { Question } from '../models/question';
import { Answer } from '../models/answer';
import { QuestionsService } from '../questions.service';
import { AnswerService } from '../answer.service';
import { TakeQuizService } from '../take-quiz.service';
import { QuizService } from '../quiz.service';
import { ResultsService } from '../results.service';
import { FormControl, FormGroup } from '@angular/forms';
import { distinct } from 'rxjs/internal/operators';
import { error } from '@angular/compiler/src/util';
import { Result } from '../models/result';
import { UserQuiz } from '../models/userquiz';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css']
})
export class TakeQuizComponent implements OnInit {
  quizzes: Quiz[] = []; //list of all quizzes
  questions: Question[] = []; //list of all questions on quiz
  answers: Answer[] = []; //a list of all answers for the quiz
  answeredQuestion: string = ""; //a string for the answered question
  questionAnswers: Answer[] = []; //all possible answers for question
  selectedAnswer: Answer =  new Answer(); //the selected answer for question
  givenQuestion: Question = new Question(); //the current question to be answered
  questionsAnswered: number = 0; //the number of questions answered on this quiz
  numberOfCorrectAnswers: number = -1; //the number of correct answers on this quiz
  quizIndex: number = -1; //a random quiz index when picking a quiz at random
  correctAnswer: Answer = new Answer(); //the correct answer for question
  correctAnswers: Answer[] = []; //list of correct answers to quiz built as quiz is being taken
  result: Result = {
    qId: -1,
    userAnswer: "",
    userQuizId: -1,
    correct: false
  }; //the result of a question, passed to API results
  quizResults: Result[] = [] //all results for current quiz
  userQuiz: UserQuiz = new UserQuiz(); //the userquiz that will be sent to the API
  quizStarted: boolean = false;

  constructor(private questionsService: QuestionsService, private answerService: AnswerService,
    private takeQuizService: TakeQuizService, private quizService: QuizService, 
    private resultService: ResultsService, private loginService: LoginService) { }

  ngOnInit() {
    this.updateQuizList();
  }

  updateQuizList() {
    console.log("updating quiz list");
    this.quizService.getQuizzes().subscribe(data => {
      this.quizzes = data;
    }, err => console.log(err));
  }

  //runs whenever quiz starts; quiz is picked at random from list
  startQuiz() {
    console.log(this.quizzes)
    //this.quizIndex = Math.floor((Math.random() * this.quizzes.length));
    if (this.quizIndex == -1) {
      this.quizIndex = 0;
    }
    this.makeUserQuiz(this.quizzes[this.quizIndex]);
    this.getQuestions(this.quizzes[this.quizIndex]);
    this.questionsAnswered = 0;
    this.numberOfCorrectAnswers = 0;
    this.quizResults = [];
    this.quizStarted = true;
  }

  makeUserQuiz(quiz: Quiz): void {
    this.userQuiz = new UserQuiz;
    this.userQuiz.userId = <number>this.loginService.id;
    this.userQuiz.userName = this.loginService.username;
    this.userQuiz.quizId = quiz.id;
    this.userQuiz.quizMaxScore = quiz.maxScore;
    this.userQuiz.quizActualScore = 11;
    this.userQuiz.quizDate = '2021-08-02 12:00:00 AM';

    this.takeQuizService.addUserQuiz(this.userQuiz).subscribe(data => {
      this.userQuiz.userQuizId = data.userQuizId;
      this.userQuiz.quizDate = data.quizDate;
    }, err => console.log(err));
  }

  //gets all questions, includes all functions needed to set up a quiz
  getQuestions(quiz : Quiz) { this.questionsService.getQuestions(quiz).subscribe(data => {
      this.questions = data;
      this.givenQuestion = this.questions[0];
      this.getAnswers(quiz.id);
    }, err => console.log(err));
  }

  //gets all answers for the questions on the quiz, includes critical functions to set up quiz
  getAnswers(quizId: number) {
    this.answerService.getAnswers(quizId).subscribe(data => {
      this.answers = data;
      this.getQuestionAnswers(this.questions[0]);
    }, err => console.log(err));
  }

  //this runs when an answer is submitted
  submittedAnswer(quizAnswer: any) {
    if (!quizAnswer.quizAnswer || quizAnswer.quizAnswer == undefined) {
      quizAnswer.quizAnswer = this.questionAnswers[0].id;
    }
    this.findAnswer(quizAnswer);
    
    if(this.selectedAnswer.correct)
    {
      this.numberOfCorrectAnswers++;
    }
    this.sendResult(this.selectedAnswer);
 
    this.getCorrectAnswer(this.questionAnswers);
    this.correctAnswers[this.questionsAnswered] = new Answer();
    this.correctAnswers[this.questionsAnswered].copyAnswer(this.correctAnswer);

    this.questionsAnswered++;
    if (this.questionsAnswered < this.quizzes[this.quizIndex].maxScore)
    {
    this.givenQuestion = this.questions[this.questionsAnswered];
    this.questionAnswers = [];
    this.getQuestionAnswers(this.questions[this.questionsAnswered]);
    this.getCorrectAnswer(this.questionAnswers);
    }
    else
    {
      this.setUserQuizScore(this.numberOfCorrectAnswers);
    }
    this.answeredQuestion = "";
  }

  //this runs when a fill-in-the-blank answer is submitted
  submittedFillAnswer() {
    if (!this.answeredQuestion || this.answeredQuestion == undefined) {
      this.answeredQuestion = "+++ NO ANSWER +++";
    }
    
    if(this.checkFillAnswer(this.answeredQuestion))
    {
      this.numberOfCorrectAnswers++;
    }
    this.sendResultString(this.answeredQuestion);
    
    this.getCorrectAnswer(this.questionAnswers);
    this.correctAnswers[this.questionsAnswered] = new Answer();
    this.correctAnswers[this.questionsAnswered].copyAnswer(this.correctAnswer);

    this.questionsAnswered++;
    if (this.questionsAnswered < 10)
    {
      this.givenQuestion = this.questions[this.questionsAnswered];
      this.questionAnswers = [];
      this.getQuestionAnswers(this.questions[this.questionsAnswered]);
      this.getCorrectAnswer(this.questionAnswers);
      this.correctAnswers[this.questionsAnswered - 1] = new Answer();
      this.correctAnswers[this.questionsAnswered - 1].copyAnswer(this.correctAnswer);
    }
    else
    {
      this.setUserQuizScore(this.numberOfCorrectAnswers);
    }
    this.answeredQuestion = "";
  }

  //sends the result of each question asked
  sendResult(answer: Answer) {
    let tempResult: Result = new Result;
    tempResult.userAnswer = answer.answer;
    tempResult.qId = answer.questionId;
    tempResult.correct = answer.correct;
    tempResult.userQuizId = 1;
    this.quizResults.push(tempResult); 
    this.resultService.sendResult(tempResult).subscribe(data => {
      this.resultService.questionResult = data;
    });
  }

  sendResultString(answer: string) {
    let tempResult: Result = new Result;
    tempResult.userAnswer = answer;
    tempResult.qId = <number>this.givenQuestion.id;
    tempResult.correct = answer === this.correctAnswer.answer ? true : false; 
    tempResult.userQuizId = 1;
    this.quizResults.push(tempResult); 
    this.resultService.sendResult(tempResult).subscribe(data => {
      this.resultService.questionResult = data;
    });
  }

  //this checks whether a fill-in-the-blank answer is correct
  checkFillAnswer(answer: string): boolean {
    if (answer === this.correctAnswer.answer) {
      return true;
    } else {
      return false;
    }
  }

  setUserQuizScore(score: number){
    this.takeQuizService.updateMaxUserQuizScore(score).subscribe(data => {
      }, err => console.log(err));
  }
  
  //this returns the correct answer for the question out of all possible answers for said question
  getCorrectAnswer(possibleAnswers: Answer[]): Answer {
    for (var i = 0; i < possibleAnswers.length; i++)
    {
      if (possibleAnswers[i].correct)
      {
        this.correctAnswer = possibleAnswers[i];
      }
    }
    return this.correctAnswer;
  }

  //this gets a list of all answers associated with a given question
  getQuestionAnswers(question: Question) {
    for (var i = 0; i < this.answers.length; i++)
    {
      if (this.answers[i].questionId === question.id)
      {
        this.questionAnswers.push(this.answers[i]);
      }  
    }
    console.log(this.questionAnswers)
  }

  findAnswer(quizAnswer: any) {
    this.questionAnswers.forEach(value => {
      if (value.id == quizAnswer.quizAnswer) {
        this.selectedAnswer.copyAnswer(value);
      }
    });
  }

  //this returns the quiz percentage (ex: 80, 90, 20, etc.)
  calculateScore(): number {
    return this.numberOfCorrectAnswers * 10;
  }
}