import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

export async function POST(request: NextRequest) {
  console.log('📨 API Route: POST /api/gpt/health');

  try {
    // Verificar token de Firebase
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    await admin.auth().verifyIdToken(token);

    console.log('✅ Health check exitoso');

    return NextResponse.json({
      status: 'ok',
      openai: !!process.env.OPENAI_API_KEY,
      firebase: !!process.env.FIREBASE_PROJECT_ID,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date(),
    });

  } catch (error: any) {
    console.error('❌ Error en health check:', error);
    
    return NextResponse.json({
      status: 'error',
      openai: false,
      firebase: false,
      error: error.message,
      timestamp: new Date(),
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST for health check.' },
    { status: 405 }
  );
}