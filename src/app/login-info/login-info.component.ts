import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login-info',
  templateUrl: './login-info.component.html',
  styleUrls: ['./login-info.component.css']
})
export class LoginInfoComponent implements OnInit {

  username: string = "";
  role: string = "";
  id: number | null = null;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    if (sessionStorage.getItem('account')) {
      if (JSON.parse(<string>sessionStorage.getItem('account'))['userId'] === null) {
        this.id = -1;
      } else {
        this.id = JSON.parse(<string>sessionStorage.getItem('account'))['userId'];
      }
      if (JSON.parse(<string>sessionStorage.getItem('account'))['username'] === null) {
        this.username = "not logged in";
      } else {
        this.username = JSON.parse(<string>sessionStorage.getItem('account'))['username'];
      }
      if (JSON.parse(<string>sessionStorage.getItem('account'))['roles'] === null) {
        this.role = "role undefined";
      } else {
        this.role = JSON.parse(<string>sessionStorage.getItem('account'))['roles'];
      }
      
      this.loginService.id = this.id;
      this.loginService.username = this.username;
    } 
  }
}