import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { logInUserDto } from './dto/loginUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@ApiTags('login')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async logIn(@Body() logInIUserDto: logInUserDto, @Res() response: Response) {
    const user = await this.authService.logIn(logInIUserDto);
    response.status(HttpStatus.OK).json({ name: user.name });
  }
}
