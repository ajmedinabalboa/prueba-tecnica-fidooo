import { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

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
    await admin.auth().verifyIdToken(token);

    return res.status(200).json({
      status: 'ok',
      openai: !!process.env.OPENAI_API_KEY,
      timestamp: new Date(),
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      openai: false,
      timestamp: new Date(),
    });
  }
}