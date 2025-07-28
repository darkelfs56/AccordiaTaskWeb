import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { extractHttpError } from '../utils/extract-http-error';

export enum MessageAuthorRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AIChatbotService {
  http = inject(HttpClient);

  messages = signal<Message[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  async uploadPdf(formData: FormData) {
    const apiUrl = environment.apiUrl + '/aichatbot/upload-pdf';

    return this.http
      .post(apiUrl, formData, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          const errMsg =
            err instanceof Error
              ? extractHttpError(err)
              : 'Something went wrong with Groq API';
          this.error.set(errMsg);
          throw err;
        })
      );
  }
  
  async getGreetMessage() {
    const apiUrl = environment.apiUrl + '/aichatbot/greet-message';
    
    this.http.get<{ message: string }>(apiUrl, {
      withCredentials: true,
    }).pipe(
      catchError((err) => {
        const errMsg = err instanceof Error ? extractHttpError(err) : 'Something went wrong with Groq API';
        this.error.set(errMsg);
        throw err;
      })
    ).subscribe((response) => {
      const text = response.message ?? '';
      const botGreetMessage: Message = {
        role: MessageAuthorRole.ASSISTANT,
        content: text,
        timestamp: new Date(),
      };
      console.log(`message is: ${botGreetMessage}`);
      this.messages.update((messages) => [...messages, botGreetMessage]);
      this.isLoading.set(false);
    })
  }

  async sendMessage(userInput: string) {
    if (!userInput.trim()) return;
    const apiUrl = environment.apiUrl + '/aichatbot/send-message';

    const userMsg: Message = {
      role: MessageAuthorRole.USER,
      content: userInput,
      timestamp: new Date(),
    };
    this.messages.update((msgs) => [...msgs, userMsg]);
    this.isLoading.set(true);
    this.error.set(null);

    this.http
      .post<{ message: string }>(apiUrl, userMsg, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          const errMsg =
            err instanceof Error
              ? extractHttpError(err)
              : 'Something went wrong with Groq API';
          this.error.set(errMsg);
          throw err;
        })
      )
      .subscribe((response) => {
        const text = response.message ?? '';
        const botMsg: Message = {
          role: MessageAuthorRole.ASSISTANT,
          content: text,
          timestamp: new Date(),
        };
        this.messages.update((msgs) => [...msgs, botMsg]);
        this.isLoading.set(false);
      });
  }

  async getMessageHistory() {
    const apiUrl = environment.apiUrl + '/aichatbot/message-history';
    this.http
      .get(apiUrl)
      .pipe(
        catchError((err) => {
          const errMsg =
            err instanceof Error
              ? extractHttpError(err)
              : 'Something went wrong with Groq API';
          this.error.set(errMsg);
          throw err;
        })
      )
      .subscribe((response) => {
        console.log(`response is:\n`);
        console.dir(response, { depth: Infinity });
      });
  }

  clearChat() {
    this.messages.set([]);
    this.error.set(null);
  }
}
