import { ApiResponse } from '../interfaces/api-response.interface';

export class ResponseUtil {
  static success<T>(data?: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static error(error: string, message?: string): ApiResponse {
    return {
      success: false,
      error,
      message,
      timestamp: new Date().toISOString(),
    };
  }
}

