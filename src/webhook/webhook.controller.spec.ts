import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { RateLimitService } from './rate-limit.service';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import * as admin from 'firebase-admin';


jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn().mockResolvedValue({}),
    FieldValue: {
      serverTimestamp: jest.fn().mockReturnValue('mocked-timestamp')
    }
  })),
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'mockUser' }),
  })),
}));

describe('WebhookController', () => {
  let controller: WebhookController;
  let module: TestingModule;
  let webhookService: WebhookService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: WebhookService,
          useValue: {
            storeMessage: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: RateLimitService,
          useValue: {
            allowRequest: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'WEBHOOK_SECRET_TOKEN') return 'SECRET_TOKEN';
              return null;
            }),
          },
        },
        {
          provide: 'FIREBASE_ADMIN',
          useValue: admin,
        },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
    webhookService = module.get<WebhookService>(WebhookService);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should reject requests with invalid token', async () => {
    await expect(
      controller.handleWebhook({ message: 'Hello', phone: '+1234567890' }, 'Bearer INVALID_TOKEN')
    ).rejects.toThrow(HttpException);
  });

  it('should allow requests with a valid token', async () => {
    const result = await controller.handleWebhook(
      { message: 'Hello', phone: '+1234567890' },
      'Bearer SECRET_TOKEN'
    );
    expect(result).toEqual({ success: true });
    expect(webhookService.storeMessage).toHaveBeenCalledWith('+1234567890', 'Hello');
  });

  it('should return help message for help-related queries', async () => {
    const result = await controller.handleWebhook(
      { message: 'help me please', phone: '+1234567890' },
      'Bearer SECRET_TOKEN'
    );
    expect(result).toEqual({ reply: 'Support contact: support@company.com' });
  });
});