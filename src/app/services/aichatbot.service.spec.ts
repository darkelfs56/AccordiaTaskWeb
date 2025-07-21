import { TestBed } from '@angular/core/testing';

import { AIChatbotService } from './aichatbot.service';

describe('AIChatbotService', () => {
  let service: AIChatbotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AIChatbotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
