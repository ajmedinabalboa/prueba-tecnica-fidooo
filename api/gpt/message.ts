import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import admin from 'firebase-admin';

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verificar token de Firebase
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no válido' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    console.log('👤 Usuario autenticado:', decodedToken.email);

    // Procesar mensaje con ChatGPT
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Texto requerido' });
    }

    console.log('🤖 Enviando a OpenAI:', text);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente útil y amigable. Responde de manera concisa y natural. Usuario: ${decodedToken.email}`,
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
      throw new Error('No se pudo generar respuesta');
    }

    console.log('✅ Respuesta generada:', response.substring(0, 50) + '...');

    return res.status(200).json({
      text: response,
      timestamp: new Date(),
      usage: completion.usage,
    });

  } catch (error) {
    console.error('❌ Error:', error);
    
    if (typeof error === 'object' && error !== null && 'response' in error && (error as any).response?.status === 401) {
      return res.status(500).json({ 
        message: 'Error de autenticación con OpenAI' 
      });
    }

    return res.status(500).json({
      text: `Lo siento, no pude procesar tu mensaje. Error: ${typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error)}`,
      timestamp: new Date(),
    });
  }
}