import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, ToggleUserActiveDto, ChangePasswordDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const users = await this.prismaService.user.findMany({
      include: {
        groups: {
          select: {
            name: true,
          },
        },
      },
    });
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      employee_number: user.employee_number,
      email: user.email,
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      groups: user.groups.map((group) => group.name).join(', '),
    }));
  }

  async change_user_details(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`ID:${id}を持つユーザは存在しません`);
    }
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async toggle_user_active(
    id: number,
    toggleUserActiveDto: ToggleUserActiveDto,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`ID:${id}を持つユーザは存在しません`);
    }
    return this.prismaService.user.update({
      where: { id },
      data: toggleUserActiveDto,
    });
  }

  async change_password(changePasswordDto: ChangePasswordDto) {
    console.log(changePasswordDto);
  }
}
