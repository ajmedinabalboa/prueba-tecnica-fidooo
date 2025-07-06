import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';

@Module({
  imports: [ThrottlerModule],
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}