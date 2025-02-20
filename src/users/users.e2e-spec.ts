import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET users should return paginated results', () => {
    return request(app.getHttpServer())
      .get('/users?limit=2')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
