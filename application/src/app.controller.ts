import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   *
   * @returns all users
   */
  @Get()
  findAll(): string {
    return 'This action returns all users';
  }
}
