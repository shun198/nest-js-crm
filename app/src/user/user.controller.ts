import {
  Get,
  Post,
  Patch,
  Body,
  Controller,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { InviteUserDto } from './dto/inviteUser.dto';
import { CheckTokenDto } from './dto/checkToken.dto';
import { AdminAuthGuard } from 'src/guards/admin-auth.guard';
import { UserAuthGuard } from 'src/guards/user-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AdminAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'ユーザを一覧表示',
    content: {
      'application/json': {
        example: [
          {
            id: 1,
            name: 'テストユーザゼロイチ',
            employee_number: '00000001',
            email: 'test_user_01@example.com',
            is_active: true,
            createdAt: '2024-03-08T00:33:27.790Z',
            updatedAt: '2024-03-08T00:33:27.790Z',
          },
        ],
      },
    },
  })
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id/toggle_user_active')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  toggle_user_active(@Param('id') id: string) {
    return this.userService.toggle_user_active(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('send_invite_user_email')
  @HttpCode(HttpStatus.OK)
  send_invite_user_email(@Body() inviteUserDto: InviteUserDto) {
    return this.userService.send_invite_user_email(inviteUserDto);
  }

  @Post('verify_user')
  @HttpCode(HttpStatus.OK)
  verify_user(@Body() verifyUserDto: VerifyUserDto) {
    return this.userService.verify_user(verifyUserDto);
  }

  @Post('change_password')
  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  change_password(@Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.change_password(changePasswordDto);
  }

  @Post('check_invite_user_token')
  @HttpCode(HttpStatus.OK)
  check_invite_user_token(@Body() checkTokenDto: CheckTokenDto) {
    return this.userService.check_invite_user_token(checkTokenDto);
  }

  @Post('check_reset_password_token')
  @HttpCode(HttpStatus.OK)
  check_reset_password_token(@Body() checkTokenDto: CheckTokenDto) {
    return this.userService.check_reset_password_token(checkTokenDto);
  }
}
