'use client';
import { useState, useCallback } from 'react';
import { chatService } from '@/services/chatService';
import { ChatGPTResponse } from '@/services/types';

export const useChatService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string): Promise<ChatGPTResponse | null> => {
    console.log('🔗 [HOOK] Iniciando envío de mensaje a ChatGPT...');
    setLoading(true);
    setError(null);

    try {
      const response = await chatService.sendMessage(text);
      console.log('✅ [HOOK] Respuesta recibida exitosamente');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ [HOOK] Error en el servicio:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      await chatService.healthCheck();
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    sendMessage,
    checkHealth,
    loading,
    error,
    clearError: () => setError(null),
  };
};