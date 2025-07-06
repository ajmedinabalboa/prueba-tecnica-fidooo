import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  private defaultApp: admin.app.App;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });

    // Inicializar Firebase Admin
    this.defaultApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  async validate(token: string) {
    try {
      const firebaseUser = await this.defaultApp.auth().verifyIdToken(token, true);
      if (!firebaseUser) {
        throw new UnauthorizedException();
      }
      return firebaseUser;
    } catch (err) {
      console.error('Error validating Firebase token:', err);
      throw new UnauthorizedException();
    }
  }
}