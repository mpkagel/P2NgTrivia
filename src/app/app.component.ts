import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'P2-Angular Trivia';

  public constructor(private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle("P2Angular Trivia");
  }

}
