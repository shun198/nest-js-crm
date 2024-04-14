import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInUserDto } from './dto/loginUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@ApiTags('login')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async logIn(
    @Body() logInUserDto: LogInUserDto,
    @Req() request: any,
    @Res() response: any,
  ) {
    const user = await this.authService.validateUser(
      logInUserDto.employee_number,
      logInUserDto.password,
    );
    request.session.user = user;
    response.status(HttpStatus.OK).json({ name: user.name, role: user.role });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: any): Promise<void> {
    request.session.destroy();
  }
}
