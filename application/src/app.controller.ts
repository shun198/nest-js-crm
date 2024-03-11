import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('health')
  @Get('health')
  @ApiResponse({
    status: 200,
    description: 'ヘルスチェック成功',
    content: {
      'application/json': {
        example: { msg: 'pass' },
      },
    },
  })
  healthCheck(): { msg: string } {
    return this.appService.healthCheck();
  }
}
