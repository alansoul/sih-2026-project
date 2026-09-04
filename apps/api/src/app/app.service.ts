import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'SIH-2026-Backend-API',
      version: '1.0.0',
    };
  }
}