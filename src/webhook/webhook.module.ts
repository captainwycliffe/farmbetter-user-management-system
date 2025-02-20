import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { RateLimitService } from './rate-limit.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [WebhookController],
  providers: [WebhookService, RateLimitService],
})
export class WebhookModule {}
