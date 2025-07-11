import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-and-register',
  imports: [FormsModule],
  templateUrl: './login-and-register.component.html',
  styleUrl: './login-and-register.component.scss'
})
export class LoginAndRegisterComponent {
  selectedForm = signal<'login' | 'register'>('login');

  email = signal('');
  password = signal('');

  selectForm(form: 'login' | 'register') {
    this.selectedForm.set(form);
  }

  handleSubmit() {
    const formType = this.selectedForm();

    if (formType === 'login') {
      console.log(`Login mode.\n Email is: ${this.email()}; Password is: ${this.password()}`);
      // Perform login
    } else {
      console.log(`Register mode.\n Email is: ${this.email()}; Password is: ${this.password()}`);
      // Perform registration
    }
  }
}
