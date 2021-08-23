import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { QuizListComponent } from './quiz-list/quiz-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TakeQuizComponent } from './take-quiz/take-quiz.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'quiz-list', component: QuizListComponent, canActivate: [AuthGuard] },
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'take-quiz', component: TakeQuizComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
