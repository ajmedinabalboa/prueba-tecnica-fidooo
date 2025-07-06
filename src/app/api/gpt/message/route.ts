import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import admin from 'firebase-admin';

// Inicializar Firebase Admin (solo una vez)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log('✅ Firebase Admin inicializado');
  } catch (error) {
    console.error('❌ Error inicializando Firebase Admin:', error);
  }
}

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log('📨 API Route: POST /api/gpt/message');

  try {
    // Verificar token de Firebase
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Token de autorización faltante');
      return NextResponse.json(
        { message: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    console.log('👤 Usuario autenticado:', decodedToken.email);

    // Obtener el texto del mensaje
    const body = await request.json();
    const { text } = body;
    
    if (!text || typeof text !== 'string') {
      console.log('❌ Texto del mensaje faltante o inválido');
      return NextResponse.json(
        { message: 'Texto del mensaje requerido' },
        { status: 400 }
      );
    }

    console.log('🤖 Enviando a OpenAI:', text.substring(0, 50) + '...');

    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente útil y amigable en un chat en tiempo real. 
                   Responde de manera concisa y natural. 
                   El usuario que te escribió es: ${decodedToken.email}`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      console.log('❌ OpenAI no devolvió contenido');
      throw new Error('No se pudo generar respuesta de ChatGPT');
    }

    console.log('✅ Respuesta generada:', response.substring(0, 50) + '...');

    return NextResponse.json({
      text: response,
      timestamp: new Date(),
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0,
      },
    });

  } catch (error: any) {
    console.error('💥 Error en API route:', error);
    
    // Manejo específico de errores
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { message: 'Token expirado. Por favor, inicia sesión nuevamente.' },
        { status: 401 }
      );
    }

    if (error.response?.status === 429) {
      return NextResponse.json(
        { message: 'Límite de requests excedido. Intenta de nuevo en unos minutos.' },
        { status: 429 }
      );
    }

    if (error.response?.status === 401) {
      return NextResponse.json(
        { message: 'Error de autenticación con OpenAI. Verifica la API key.' },
        { status: 500 }
      );
    }

    // Error genérico
    return NextResponse.json({
      text: `Lo siento, no pude procesar tu mensaje en este momento. Error: ${error.message}`,
      timestamp: new Date(),
    }, { status: 500 });
  }
}

// Método GET para manejar otros tipos de request
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST to send messages.' },
    { status: 405 }
  );
}