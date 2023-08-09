import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './authService';

@Injectable({
    providedIn: 'root'
  })
export class AuthGuard {
  constructor(private authService: AuthService, private cookieService: CookieService, private router: Router) {}

 async canActivate() {
    if (await this.authService.isLoggedIn()) {
        return true;
    }
    this.router.navigate(['/login-page']);
    return false;
  }
}
