import { Component, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { catchError, take } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  router = inject(Router);
  userService = inject(UserService);
  userRegex = signal<RegExp>(new RegExp("/@*/g"));

  title = signal('AI Resume Chatbot');
  menuOpen = signal(false);
  
  constructor() {
    this.userService.getUser().pipe(take(1)).subscribe({
      next: (user: any) => {
        this.userService.currentUser.set(user);
      },
      error: () => {
        this.userService.currentUser.set(null);
      }
    })
  }

  toggleMenu() {
    this.menuOpen.update(open => !open);
  }

  logout() {
    this.userService.logout().subscribe({
      next: () => {
        this.userService.currentUser.set(null);
        this.menuOpen.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Logout error', err);
      }
    });
  }
}
