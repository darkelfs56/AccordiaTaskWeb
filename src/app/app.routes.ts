import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./pages/home/home.component').then((m) => m.HomeComponent);
    },
  },
  {
    path: 'chat',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./pages/chat/chat.component').then((m) => m.ChatComponent);
    },
  },
];
