import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

type LoginAndRegisterData = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-login-and-register',
  imports: [FormsModule],
  templateUrl: './login-and-register.component.html',
  styleUrl: './login-and-register.component.scss',
})
export class LoginAndRegisterComponent {
  private router = inject(Router);
  userService = inject(UserService);
  selectedForm = signal<'login' | 'register'>('login');

  email = signal('');
  password = signal('');

  emailError = signal<string | null>(null);
  passwordError = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  validate(): boolean {
    const emailVal = this.email();
    const passwordVal = this.password();

    this.emailError.set(null);
    this.passwordError.set(null);

    let isValid = true;

    if (!emailVal || !emailVal.includes('@')) {
      this.emailError.set('Please enter a valid email.');
      isValid = false;
    }

    if (!passwordVal || passwordVal.length < 6) {
      this.passwordError.set('Password must be at least 6 characters.');
      isValid = false;
    }

    return isValid;
  }

  extractHttpError(err: any): string {
    console.log(`err is: ${err}`);
    if (err?.status && err?.error?.message) {
      return err.error.message;
    }

    return 'An unexpected error occurred.';
  }

  selectForm(form: 'login' | 'register') {
    this.selectedForm.set(form);
  }

  handleLogin(data: LoginAndRegisterData) {
    this.errorMessage.set(null);

    this.userService
      .loginUser(data)
      .pipe(
        catchError((err) => {
          const msg = this.extractHttpError(err);
          this.errorMessage.set(msg);
          throw err;
        })
      )
      .subscribe((jwt) => {
        if (jwt) {
          this.userService.currentUser.set({ email: data.email });
          this.router.navigate(['/chat']);
        }
      });
  }

  handleRegister(data: LoginAndRegisterData) {
    this.errorMessage.set(null);

    this.userService
      .registerUser(data)
      .pipe(
        catchError((err) => {
          const msg = this.extractHttpError(err);
          this.errorMessage.set(msg);
          throw err;
        })
      )
      .subscribe((createdUser) => {
        if (createdUser) {
          this.handleLogin(data);
        }
      });
  }

  handleSubmit() {
    if (!this.validate()) return;

    const formType = this.selectedForm();
    const data = {
      email: this.email(),
      password: this.password(),
    };

    if (formType === 'login') {
      this.handleLogin(data);
    } else {
      this.handleRegister(data);
    }
  }
}
