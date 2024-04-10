import { Controller, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Get, Post, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ToggleUserActiveDto } from './dto/toggleUserActive.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { InviteUserDto } from './dto/inviteUser.dto';
import { CheckTokenDto } from './dto/checkToken.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
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
  @HttpCode(HttpStatus.OK)
  toggle_user_active(
    @Param('id') id: string,
    @Body() toggleUserActiveDto: ToggleUserActiveDto,
  ) {
    return this.userService.toggle_user_active(Number(id), toggleUserActiveDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('send_invite_user_email')
  @HttpCode(HttpStatus.OK)
  send_invite_user_email(@Body() data: InviteUserDto) {
    return this.userService.send_invite_user_email(data);
  }

  @Post('verify_user')
  @HttpCode(HttpStatus.OK)
  verify_user(@Body() verifyUserDto: VerifyUserDto) {
    return this.userService.verify_user(verifyUserDto);
  }

  @Post('change_password')
  @HttpCode(HttpStatus.OK)
  change_password(@Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.change_password(changePasswordDto);
  }

  @Post('check_invite_user_token')
  @HttpCode(HttpStatus.OK)
  check_invite_user_token(@Body() data: CheckTokenDto) {
    return this.userService.check_invite_user_token(data);
  }

  @Post('check_reset_password_token')
  @HttpCode(HttpStatus.OK)
  check_reset_password_token(@Body() data: CheckTokenDto) {
    return this.userService.check_reset_password_token(data);
  }
}
