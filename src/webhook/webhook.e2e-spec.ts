import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('WebhookController (e2e)', () => {
  let app: INestApplication;
  const secretToken = 'SECRET_TOKEN';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return support contact for "help" messages', () => {
    return request(app.getHttpServer())
      .post('/webhook')
      .set('Authorization', `Bearer ${secretToken}`)
      .send({ message: 'help', phone: '+1234567890' })
      .expect(201)
      .expect((res) => {
        expect(res.body.reply).toBe('Support contact: support@company.com');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
