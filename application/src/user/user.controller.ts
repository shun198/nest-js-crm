import {
  Controller,
  Get,
  Body,
  Param,
  Post,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, ToggleUserActiveDto, ChangePasswordDto } from './dto';
import { ApiResponse } from '@nestjs/swagger';

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
            groups: '管理者',
          },
        ],
      },
    },
  })
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id/change_user_details')
  change_user_details(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.change_user_details(Number(id), updateUserDto);
  }

  @Patch(':id/toggle_user_active')
  toggle_user_active(
    @Param('id') id: string,
    @Body() toggleUserActiveDto: ToggleUserActiveDto,
  ) {
    return this.userService.toggle_user_active(Number(id), toggleUserActiveDto);
  }

  @Post('change_password')
  @HttpCode(200)
  change_password(@Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.change_password(changePasswordDto);
  }
}
