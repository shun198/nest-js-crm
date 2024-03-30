import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ToggleUserActiveDto } from './dto/toggleUserActive.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const users = await this.prismaService.user.findMany({});
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      employee_number: user.employee_number,
      email: user.email,
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        name: true,
        employee_number: true,
        email: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`id:${id}を持つユーザは存在しません`);
    }
    return user;
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
}
