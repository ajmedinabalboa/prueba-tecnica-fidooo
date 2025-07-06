import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  logger.log('🚀 === INICIANDO APLICACIÓN ===');
  
  const app = await NestFactory.create(AppModule);

  // Log de variables de entorno (sin mostrar valores sensibles)
  logger.log('🔍 Verificando variables de entorno...');
  logger.log(`PORT: ${process.env.PORT || 3001}`);
  logger.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  logger.log(`FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID || 'NO CONFIGURADO'}`);
  logger.log(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'CONFIGURADO ✅' : 'NO CONFIGURADO ❌'}`);

  // Configurar CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  logger.log('✅ CORS configurado');

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  logger.log('✅ Validación global configurada');

  // Configurar prefijo global
  app.setGlobalPrefix('api');
  logger.log('✅ Prefijo API configurado');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  logger.log('🎉 === APLICACIÓN INICIADA EXITOSAMENTE ===');
  logger.log(`🌍 Servidor corriendo en: http://localhost:${port}/api`);
  logger.log(`📋 Health check: http://localhost:${port}/api/gpt/health`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('💥 Error iniciando aplicación:', error);
});