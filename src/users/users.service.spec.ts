import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as admin from 'firebase-admin';

jest.mock('firebase-admin', () => ({
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ empty: false }),
    }),
  }),
}));

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should prevent duplicate user creation', async () => {
    await expect(service.createUser({ name: 'John', email: 'test@example.com', phone: '+1234567890' }))
      .rejects.toThrow('User with this email or phone already exists');
  });
});
