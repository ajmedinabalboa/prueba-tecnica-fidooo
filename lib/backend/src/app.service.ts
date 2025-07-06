import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'ChatGPT Backend API is running! 🚀';
  }
}