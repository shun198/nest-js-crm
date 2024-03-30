import { Controller, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Get, Post, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ToggleUserActiveDto } from './dto/toggleUserActive.dto';
import { CreateUserDto } from './dto/createUser.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Patch(':id/toggle_user_active')
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
}
