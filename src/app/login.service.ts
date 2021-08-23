import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from './models/login';
import { Account } from './models/account';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  
  username: string = "";
  id: number | null = null;

  async login(login: Login): Promise<Account> {
    // first, send request to login
    const url = `${environment.apiUrl}/api/Users/Login`;
    const response = await this.http.post(url, login, {
      observe: 'response',
      withCredentials: true
    }).toPromise();
    // then, send request to details
    const url2 = `${environment.apiUrl}/api/Users/Details`;
    const account = await this.http.get<Account>(url2, { 
      withCredentials: true 
    }).toPromise();    

    sessionStorage.setItem('account', JSON.stringify(account));

    return account;
    // when we get that, save in session storage the logged in user's info
    // (so if client refreshes page, we still have it)

    // return the account details to the one calling this method
  }
}
