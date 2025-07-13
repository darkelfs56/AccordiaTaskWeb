import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, Chat, GenerateContentConfig } from '@google/genai';
import { environment } from '../../environments/environment';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const DEFAULT_CONTEXT = `You are an AI Resume Chatbot. When a user provides their resume, analyze its strengths and weaknesses. If the user provides a job link, extract the job requirements from the page and evaluate how well the resume matches the job. Be honest, helpful, and practical.`;

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private geminiClient: GoogleGenAI | null = null;
  private chatSession: Chat | null = null;

  messages = signal<Message[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  private groundingTool = {
    googleSearch: {},
  };
  private urlTool = {
    urlContext: {}
  };
  private config: GenerateContentConfig = {
    tools: [this.groundingTool, this.urlTool],
    systemInstruction: DEFAULT_CONTEXT,
  };

  constructor() {
    if (!environment.geminiApiKey) {
      this.error.set('Missing Gemini API Key. Check environment config.');
      return;
    }

    this.geminiClient = new GoogleGenAI({apiKey: environment.geminiApiKey});
  }

  async sendMessage(userInput: string): Promise<void> {
    if (!this.geminiClient || !userInput.trim()) return;

    const userMsg: Message = {
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };
    this.messages.update((msgs) => [...msgs, userMsg]);
    this.isLoading.set(true);
    this.error.set(null);

    try {
      // Start new chat if needed
      if (!this.chatSession) {
        const chat = this.geminiClient.chats.create({
          model: 'gemini-2.0-flash',
          config: this.config,
        });

        this.chatSession = chat;
      }

      const response = await this.chatSession.sendMessage({ message: userMsg.content });
      const text = response.text ?? "";
      const botMsg: Message = {
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };
      this.messages.update((msgs) => [...msgs, botMsg]);
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : 'Something went wrong with Gemini API';
      this.error.set(errMsg);
    } finally {
      this.isLoading.set(false);
    }
  }

  clearChat() {
    this.messages.set([]);
    this.chatSession = null;
    this.error.set(null);
  }
}
