import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';

@Module({
  imports: [PassportModule],
  providers: [FirebaseAuthStrategy],
  exports: [FirebaseAuthStrategy],
})
export class AuthModule {}