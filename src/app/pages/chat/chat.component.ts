import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  userInput = signal('');
  geminiService = inject(GeminiService);

  isSendDisabled = computed(() => 
    !this.userInput().trim() || 
    this.geminiService.isLoading()
  );

  async sendMessage(): Promise<void> {
    const message = this.userInput().trim();
    if (message && !this.geminiService.isLoading()) {
      this.userInput.set('');
      await this.geminiService.sendMessage(message);
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}