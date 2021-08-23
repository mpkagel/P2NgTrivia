import { Component, OnInit } from '@angular/core';
import { Login } from '../models/login';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { Account } from '../models/account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: Login = new Login();
  account: Account = {userId: -1, username: "", roles: []};
  unauthorized: string = "";

  constructor(
    private api: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.unauthorized = "";
  }

  onSubmit() {
    this.api.login(this.login).then((account: Account) => {      
      this.router.navigate(['/quiz-list'])
        .then(() => {
          window.location.reload();
        });
    },
      error => {
        console.log(error);
        if (error.status === 401 || error.status === 403)
        {
          this.unauthorized = "Bad login credentials, please try again.";
        }
      });
  }
}