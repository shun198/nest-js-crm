import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { logInUserDto } from './dto/loginUser.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('login')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  logIn(@Body() logInIUserDto: logInUserDto) {
    return this.authService.logIn(logInIUserDto);
  }
}
