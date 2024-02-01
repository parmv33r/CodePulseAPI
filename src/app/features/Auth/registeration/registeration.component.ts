// import { Component } from '@angular/core';
// import { RegisterRequest } from '../models/register-request.model';
// import { AuthService } from '../auth.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-registeration',
//   templateUrl: './registeration.component.html',
//   styleUrls: ['./registeration.component.css']
// })
// export class RegisterationComponent {

//   model: RegisterRequest;
//   registrationSuccess: boolean = false;
//   registrationError: boolean = false;

//   constructor(private authService: AuthService, private router: Router) {
//     this.model = {
//       firstName: '',
//       lastName: '',
//       email: '',
//       password: ''
//     }
//   }

//   onFormSubmit(): void {

//     // console.log(this.model);

//     this.authService.register(this.model)
//       .subscribe(
//         {
//           next: (response) => {

//             this.registrationSuccess = true;
//             // Redirect to login page after a delay
//             setTimeout(() => {
//               this.router.navigateByUrl('/login');
//             }, 2000); // Delay for 2 seconds (adjust as needed)
//           },
//           error: (err) => {
//             this.registrationError = true;
//             // Hide the error message after 2 seconds (adjust as needed)
//             setTimeout(() => {
//               this.registrationError = false;
//             }, 2000);
//           }
//         }
//       );
//   }
// }

import { Component } from '@angular/core';
import { RegisterRequest } from '../models/register-request.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent {

  model: RegisterRequest;
  registrationSuccess: boolean = false;
  registrationError: boolean = false;
  serverValidationErrors: any = {};
  serverErrors: string[] = [];

  constructor(private authService: AuthService, private router: Router) {
    this.model = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
  }

  onFormSubmit(): void {
    this.serverErrors = [];
    this.authService.register(this.model)
      .subscribe({
        next: (response) => {
          this.registrationSuccess = true;
          // Redirect to login page after a delay
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 2000); // Delay for 2 seconds (adjust as needed)
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400 && err.error.errors) {
            // Server-side validation failed
            this.serverErrors.push(...err.error.errors['']);
          } else {
            // Handle other types of errors (e.g., server error)
            console.error(err);
            this.registrationError = true;
            // Hide the error message after 2 seconds (adjust as needed)
            setTimeout(() => {
              this.registrationError = false;
            }, 2000);
          }
        }
      });
  }

}
