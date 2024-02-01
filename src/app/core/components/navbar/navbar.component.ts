import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/features/Auth/auth.service';
import { User } from 'src/app/features/Auth/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user?:User;
  constructor(private authService: AuthService, private router:Router) {

  }
  ngOnInit(): void {
    this.authService.user()
      .subscribe({
        next: (response) => {
          //console.log(response);
          this.user = response;
        }
      });

      this.user = this.authService.getUser();
  }

  onLogout():void
  {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
