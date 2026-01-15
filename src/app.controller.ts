import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Приветственное сообщение' })
  @ApiResponse({ status: 200, description: 'Возвращает приветственное сообщение' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Проверка статуса Redis' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает статус подключения к Redis',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'connected' },
        ping: { type: 'string', example: 'PONG' },
      },
    },
  })
  async getHealth() {
    return this.appService.getRedisStatus();
  }
}
