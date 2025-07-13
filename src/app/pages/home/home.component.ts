import { Component, inject } from '@angular/core';
import { LoginAndRegisterComponent } from "../../components/login-and-register/login-and-register.component";
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  imports: [LoginAndRegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  router = inject(Router);
  userService = inject(UserService);

  constructor() {
    if(this.userService.currentUser()) {
      this.router.navigate(['/chat']);
    }
  }
}
