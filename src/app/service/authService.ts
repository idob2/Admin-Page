import { Injectable } from '@angular/core';
import { DataService } from './dataService';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private API_BASE_URL = 'http://ec2-3-137-173-135.us-east-2.compute.amazonaws.com:3000/api/v1';
  private API_BASE_URL = 'http://localhost:3000/api/v1';

  constructor(
    private cookieService: CookieService
  ) {}

  async isTokenVerified() {
    try {
      await axios.get(`${this.API_BASE_URL}/protected`);
      return true;
    } catch (error) {
      return false;
    }
  }

  isLoggedIn(): boolean {
    const token = this.cookieService.get('myToken');
    return Boolean(token);
  }
  
  
  async loginUser(username: string, password: string) {
    const response = await axios.post(`${this.API_BASE_URL}/login/`, {
      username: username,
      password: password,
    });
    const token = response.data.accessToken;
    console.log('res:', token);
    
    await this.cookieService.set('myToken', token);
    console.log('token:', this.cookieService.get('myToken'));
  }
  
  async deleteCookie() {
    this.cookieService.delete('myToken');
  }
  
}