import { Controller, Post, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { RateLimitService } from './rate-limit.service';
import { ConfigService } from '@nestjs/config';

@Controller('webhook')
export class WebhookController {
  private readonly secretToken: string;

  constructor(
    private readonly webhookService: WebhookService,
    private readonly rateLimitService: RateLimitService,
    private readonly configService: ConfigService
  ) {
    this.secretToken = this.configService.get<string>('WEBHOOK_SECRET_TOKEN')!;
  }

  @Post()
  async handleWebhook(
    @Body() body: { message: string; phone: string },
    @Headers('authorization') authHeader: string
  ) {

    if (!authHeader || authHeader !== `Bearer ${this.secretToken}`) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (!body.message || !body.phone) {
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST);
    }

    if (!this.rateLimitService.allowRequest(body.phone)) {
      throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
    }

    await this.webhookService.storeMessage(body.phone, body.message);

    if (body.message.toLowerCase().includes('help')) {
      return { reply: 'Support contact: support@company.com' };
    }

    return { success: true };
  }
}
