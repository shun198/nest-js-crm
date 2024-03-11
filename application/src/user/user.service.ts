import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

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

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`ID:${id}を持つユーザは存在しません`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({ data: createUserDto });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundException(`ID:${id}を持つユーザは存在しません`);
    }
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundException(`ID:${id}を持つユーザは存在しません`);
    }
    return this.prismaService.user.delete({ where: { id } });
  }
}
