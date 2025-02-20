import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitService {
  private requestCounts = new Map<string, { count: number; timestamp: number }>();
  private readonly limit = 5; 
  private readonly interval = 60 * 1000; 

  allowRequest(phone: string): boolean {
    const currentTime = Date.now();
    const entry = this.requestCounts.get(phone);

    if (!entry || currentTime - entry.timestamp > this.interval) {

      this.requestCounts.set(phone, { count: 1, timestamp: currentTime });
      return true;
    }

    if (entry.count < this.limit) {
      entry.count++;
      return true;
    }

    return false; 
  }
}
