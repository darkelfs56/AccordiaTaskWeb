import { Component } from '@angular/core';
import { LoginAndRegisterComponent } from "../../components/login-and-register/login-and-register.component";

@Component({
  selector: 'app-home',
  imports: [LoginAndRegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
