import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { AuthService } from '../auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  model: LoginRequest;

  constructor(private authService:AuthService, private cookieService:CookieService, private router:Router)
  {
    this.model = {
      email:'',
      password:'',
     
    };
  }

  onFormSubmit():void
  {
    this.authService.login(this.model)
    .subscribe(
      {
        next: (response) => {
          // Set Auth Cookie
          this.cookieService.set('Authorization',`Bearer ${response.token}`,undefined, '/', undefined, true, 'Strict');


          //set the user 

          this.authService.setUser({
            email: response.email,
            roles: response.roles,
            firstName: response.firstName,
            lastName: response.lastName
          });
          
          //Redirect back to Home
          this.router.navigateByUrl('/');
        }
      }
    );
  }
}
