import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: 'El mensaje no puede exceder 1000 caracteres' })
  text: string;
}

export class GptResponseDto {
  text: string;
  timestamp: Date;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}