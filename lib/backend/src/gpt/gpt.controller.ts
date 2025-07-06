import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { GptService } from './gpt.service';
import { FirebaseAuthGuard } from '../auth/auth.guard';
import { User } from '../common/decorators/user.decorator';
import { MessageDto, GptResponseDto } from './dto/message.dto';

@Controller('gpt')
@UseGuards(FirebaseAuthGuard)
export class GptController {
  private readonly logger = new Logger(GptController.name);

  constructor(private readonly gptService: GptService) {
    this.logger.log('🎮 Controlador GPT inicializado');
  }

  @Post('message')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async processMessage(
    @Body() messageDto: MessageDto,
    @User() user: any,
  ): Promise<GptResponseDto> {
    this.logger.log('📨 === NUEVA REQUEST RECIBIDA ===');
    this.logger.log(`👤 Usuario autenticado: ${user.email}`);
    this.logger.log(`📩 Request body:`, messageDto);
    this.logger.log(`🕐 Timestamp: ${new Date().toISOString()}`);

    try {
      const result = await this.gptService.processMessage(messageDto, user.email);
      
      this.logger.log('✅ Request procesada exitosamente');
      this.logger.log(`📤 Respuesta enviada: ${result.text.substring(0, 50)}...`);
      
      return result;
    } catch (error) {
      this.logger.error('💥 Error procesando request:', error);
      throw error;
    }
  }

  @Post('health')
  @HttpCode(HttpStatus.OK)
  async healthCheck(@User() user: any): Promise<any> {
    this.logger.log(`🏥 Health check solicitado por: ${user.email}`);
    
    try {
      const result = await this.gptService.healthCheck();
      this.logger.log('✅ Health check completado:', result);
      return result;
    } catch (error) {
      this.logger.error('❌ Error en health check:', error);
      throw error;
    }
  }
}