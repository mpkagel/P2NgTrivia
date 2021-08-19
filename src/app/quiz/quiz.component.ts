import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Quiz } from '../models/quiz';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  @Output() quizzesChanged = new EventEmitter();

  quiz: Quiz = new Quiz();

  constructor(private quizService: QuizService) { }

  ngOnInit() {

  }

  onSubmit() {
    if (this.quiz.category == "Beer" || this.quiz.category == "QC" || this.quiz.category == "Movie") {
        this.quizService.getRandomQuiz(this.quiz).subscribe(data => {
        this.quiz = data;
        this.quizService.randomQuiz = this.quiz;
        this.quizzesChanged.emit();
      }, err => console.log(err));
    } else {
      this.quiz = new Quiz();
    }
  }
}