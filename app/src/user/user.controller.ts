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
  Res,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CheckTokenDto } from './dto/checkToken.dto';
import { AdminAuthGuard } from 'src/guards/admin-auth.guard';
import { UserAuthGuard } from 'src/guards/user-auth.guard';
import { InviteUserDto } from './dto/inviteUser.dto';
import { ChangeUserDetailsDto } from './dto/changeUserDetails.dto';
import { SendResetPasswordMailDto } from './dto/sendResetPasswordMail.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@ApiTags('users')
@Controller('admin/users')
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

  @Get('user_info')
  async user_info(@Res() response: any) {
    const user = await this.userService.user_info();
    if (!user) {
      response.status(HttpStatus.OK).json({ name: null, role: null });
    }
    response.status(HttpStatus.OK).json({ name: user.name, role: user.role });
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

  @Patch(':id/change_user_details')
  @UseGuards(AdminAuthGuard)
  async change_user_details(
    @Param('id') id: string,
    @Res() response: any,
    @Body() changeUserDetails: ChangeUserDetailsDto,
  ) {
    const user = await this.userService.change_user_details(
      Number(id),
      changeUserDetails,
    );
    response
      .status(HttpStatus.OK)
      .json({ name: user.name, email: user.email, role: user.role });
  }

  @Post('send_invite_user_email')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  send_invite_user_email(@Body() inviteUserDto: InviteUserDto) {
    return this.userService.send_invite_user_email(inviteUserDto);
  }

  @Post(':id/resend_invitation')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  resend_invitation(@Param('id') id: string) {
    return this.userService.resend_invitation(Number(id));
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

  @Post('send_reset_password_mail')
  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  send_reset_password_mail(
    @Body() sendResetPasswordMailDto: SendResetPasswordMailDto,
  ) {
    return this.userService.send_reset_password_mail(sendResetPasswordMailDto);
  }

  @Post('reset_password')
  @HttpCode(HttpStatus.OK)
  reset_password(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.reset_password(resetPasswordDto);
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
