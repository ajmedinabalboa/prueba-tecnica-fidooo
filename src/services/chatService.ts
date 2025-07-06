import { auth } from '@/lib/firebase';
import { ChatGPTResponse, HealthCheckResponse, ApiError } from './types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // En producción usar rutas relativas
  : process.env.NEXT_PUBLIC_API_URL || '/api';

class ChatService {
  private async getAuthHeader(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const token = await user.getIdToken();
      return `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw new Error('Error de autenticación');
    }
  }

  private async handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Error ${response.status}`;
      
      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si no se puede parsear el JSON, usar mensaje por defecto
      }

      // Personalizar mensajes según el código de estado
      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
          break;
        case 403:
          errorMessage = 'Acceso denegado.';
          break;
        case 429:
          errorMessage = 'Demasiadas solicitudes. Por favor, espera un momento.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta de nuevo más tarde.';
          break;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async sendMessage(text: string): Promise<ChatGPTResponse> {
    try {
      console.log('🚀 Sending message to ChatGPT:', text.substring(0, 50) + '...');
      
      const authHeader = await this.getAuthHeader();
      
      const response = await fetch(`${API_BASE_URL}/gpt/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({ text }),
      });

      const result = await this.handleApiResponse<ChatGPTResponse>(response);
      
      console.log('✅ ChatGPT response received');
      return result;
      
    } catch (error) {
      console.error('❌ Error calling ChatGPT API:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const authHeader = await this.getAuthHeader();
      
      const response = await fetch(`${API_BASE_URL}/gpt/health`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
        },
      });

      return await this.handleApiResponse<HealthCheckResponse>(response);
      
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  // Método para verificar si la API está disponible
  async checkApiAvailability(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

// Exportar una instancia singleton
export const chatService = new ChatService();

// También exportar la clase para testing
export { ChatService };