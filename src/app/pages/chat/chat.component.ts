import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIChatbotService } from '../../services/aichatbot.service';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, MarkdownComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  userInput = signal('');
  AIChatbotService = inject(AIChatbotService);
  userLoading = signal(false);

  isSendDisabled = computed(
    () => !this.userInput().trim() || this.AIChatbotService.isLoading()
  );

  async ngOnInit() {
    return await this.AIChatbotService.getGreetMessage();
  }

  async handleFileUpload(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file && file.type === 'application/pdf') {
      this.userLoading.set(true);
      const formData = new FormData();
      formData.append('file', file);
      console.log(`file data here is: ${JSON.stringify(formData)}`);

      (await this.AIChatbotService.uploadPdf(formData)).subscribe({
        next: (response) => {
          this.userLoading.set(false);
          console.log('PDF upload success:', response);
          this.AIChatbotService.sendMessage(
            `I've uploaded a resume: ${file.name}`
          );
        },
        error: (err) => {
          this.userLoading.set(false);
          console.error('PDF upload error:', err);
        },
      });
    }
  }

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
