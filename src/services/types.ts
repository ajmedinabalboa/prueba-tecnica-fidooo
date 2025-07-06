export interface ChatGPTResponse {
  text: string;
  timestamp: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}