import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIChatbotService } from '../../services/aichatbot.service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  userInput = signal('');
  AIChatbotService = inject(AIChatbotService);

  isSendDisabled = computed(() => 
    !this.userInput().trim() || 
    this.AIChatbotService.isLoading()
  );

  async sendMessage(): Promise<void> {
    const message = this.userInput().trim();
    if (message && !this.AIChatbotService.isLoading()) {
      this.userInput.set('');
      await this.AIChatbotService.sendMessage(message);
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}