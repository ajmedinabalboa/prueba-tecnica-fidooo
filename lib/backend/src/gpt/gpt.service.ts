import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { MessageDto, GptResponseDto } from './dto/message.dto';

@Injectable()
export class GptService {
  private readonly logger = new Logger(GptService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.logger.log('🚀 Inicializando servicio ChatGPT...');
    
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    // Log de verificación de API Key (sin mostrar la clave completa)
    if (apiKey) {
      this.logger.log(`🔑 API Key encontrada: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
    } else {
      this.logger.error('❌ API Key de OpenAI no encontrada en variables de entorno');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
    
    this.logger.log('✅ Cliente OpenAI inicializado correctamente');
  }

  async processMessage(messageDto: MessageDto, userEmail: string): Promise<GptResponseDto> {
    this.logger.log('📨 === INICIANDO PROCESAMIENTO DE MENSAJE ===');
    this.logger.log(`👤 Usuario: ${userEmail}`);
    this.logger.log(`💬 Mensaje: "${messageDto.text}"`);
    this.logger.log(`📏 Longitud del mensaje: ${messageDto.text.length} caracteres`);

    const startTime = Date.now();

    try {
      this.logger.log('🤖 Enviando request a OpenAI...');
      this.logger.log('⚙️ Parámetros del request:', {
        model: 'gpt-3.5-turbo',
        max_tokens: 500,
        temperature: 0.7,
        messages_count: 2
      });

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente útil y amigable en un chat en tiempo real. 
                     Responde de manera concisa y natural. 
                     El usuario que te escribió es: ${userEmail}`
          },
          {
            role: 'user',
            content: messageDto.text
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const processingTime = Date.now() - startTime;
      this.logger.log(`⏱️ Tiempo de procesamiento: ${processingTime}ms`);

      // Log detallado de la respuesta
      this.logger.log('📥 Respuesta recibida de OpenAI:', {
        id: completion.id,
        model: completion.model,
        choices_length: completion.choices.length,
        usage: completion.usage,
        finish_reason: completion.choices[0]?.finish_reason
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        this.logger.error('❌ OpenAI no devolvió contenido en la respuesta');
        this.logger.error('❌ Completion object:', JSON.stringify(completion, null, 2));
        throw new HttpException(
          'No se pudo generar una respuesta',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      this.logger.log(`✅ Respuesta generada: "${response.substring(0, 100)}${response.length > 100 ? '...' : ''}"`);
      this.logger.log(`📊 Tokens utilizados:`, {
        prompt: completion.usage?.prompt_tokens,
        completion: completion.usage?.completion_tokens,
        total: completion.usage?.total_tokens
      });

      const result: GptResponseDto = {
        text: response,
        timestamp: new Date(),
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        }
      };

      this.logger.log('🎉 === PROCESAMIENTO EXITOSO ===');
      return result;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(`💥 === ERROR EN PROCESAMIENTO (${processingTime}ms) ===`);
      this.logger.error('❌ Error completo:', error);
      
      // Log específico según el tipo de error
      if (error.response) {
        this.logger.error('🔍 Error de respuesta HTTP:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }

      if (error.code) {
        this.logger.error('🔍 Código de error:', error.code);
      }

      if (error.message) {
        this.logger.error('🔍 Mensaje de error:', error.message);
      }

      // Manejo específico de errores de OpenAI
      if (error.response?.status === 429) {
        this.logger.error('⚠️ Rate limit excedido');
        throw new HttpException(
          'Límite de requests excedido. Intenta de nuevo en unos minutos.',
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      if (error.response?.status === 401) {
        this.logger.error('🔐 Error de autenticación con OpenAI');
        throw new HttpException(
          'Error de autenticación con OpenAI',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (error.response?.status === 400) {
        this.logger.error('📝 Error en la petición (Bad Request)');
        this.logger.error('📝 Mensaje enviado:', messageDto.text);
      }

      // Respuesta de fallback con logs
      this.logger.log('🔄 Generando respuesta de fallback...');
      const fallbackResponse: GptResponseDto = {
        text: `Lo siento, no pude procesar tu mensaje en este momento. Error: ${error.message}`,
        timestamp: new Date(),
      };

      this.logger.log('📤 Respuesta de fallback generada');
      return fallbackResponse;
    }
  }

  // Método adicional para verificar la configuración
  async healthCheck(): Promise<{ status: string; openai: boolean; timestamp: Date }> {
    this.logger.log('🏥 Verificando estado del servicio OpenAI...');
    
    try {
      // Hacer una petición simple para verificar conectividad
      const testCompletion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5,
      });

      this.logger.log('✅ Health check exitoso con OpenAI');
      return {
        status: 'ok',
        openai: true,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('❌ Health check falló:', error.message);
      return {
        status: 'degraded',
        openai: false,
        timestamp: new Date(),
      };
    }
  }
}