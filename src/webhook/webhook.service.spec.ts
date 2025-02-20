import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import * as admin from 'firebase-admin';

const mockFirestore = {
  collection: jest.fn().mockReturnValue({
    add: jest.fn().mockResolvedValue({ id: 'mockId' }),
    onSnapshot: jest.fn(),
  }),
};

const mockFirebaseAdmin = {
  firestore: jest.fn().mockReturnValue(mockFirestore),
};

describe('WebhookService', () => {
  let service: WebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        { provide: 'FIREBASE_ADMIN', useValue: mockFirebaseAdmin },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should store a message', async () => {
    await service.storeMessage('+1234567890', 'Hello');
    expect(mockFirestore.collection).toHaveBeenCalledWith('messages');
    expect(mockFirestore.collection().add).toHaveBeenCalledWith({
      phone: '+1234567890',
      message: 'Hello',
      timestamp: expect.anything(), 
    });
  });
});
