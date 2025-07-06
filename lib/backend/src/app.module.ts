import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 30, // 30 requests por minuto
      },
    ]),
    AuthModule,
    GptModule,
  ],
})
export class AppModule {}