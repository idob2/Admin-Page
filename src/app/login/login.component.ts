import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/dataService';
import { getErrorMessage } from '../utils/error.utils';
import { Router } from '@angular/router';
import {AuthService} from '../service/authService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userName: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  async ngOnInit() {
    if(await this.authService.isTokenVerified()){
      this.router.navigate(['/admin-table']);
    }
  }

  async login() {
    try {
      await this.authService.loginUser(this.userName, this.password);
      this.router.navigate(['/admin-table']);
    } catch (error) {
      alert("User Name or Password is not correct");
      console.error({ message: getErrorMessage(error) });
    }
  }
}
