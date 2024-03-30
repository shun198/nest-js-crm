import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ToggleUserActiveDto } from './dto/toggleUserActive.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { EmailService } from '../email/email.service';
import { InviteUserDto } from './dto/inviteUser.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async findAll() {
    const users = await this.prismaService.user.findMany({
      where: { is_superuser: false },
    });
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

  async create(data: CreateUserDto) {
    const existingEmailUser = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existingEmailUser) {
      throw new BadRequestException(
        'このメールアドレスはすでに使用されています',
      );
    }
    const existingEmployeeNumberUser = await this.prismaService.user.findUnique(
      {
        where: {
          employee_number: data.employee_number,
        },
      },
    );
    if (existingEmployeeNumberUser) {
      throw new BadRequestException('この社員番号はすでに使用されています');
    }
    const user = await this.prismaService.user.create({ data });
    return user;
  }

  async send_invite_user_email(data: InviteUserDto) {
    // const existingEmailUser = await this.prismaService.user.findUnique({
    //   where: {
    //     email: data.email,
    //   },
    // });
    // if (!existingEmailUser && existingEmailUser.is_verified) {
    //   throw new BadRequestException('認証済みのユーザです');
    // }
    this.emailService.welcomeEmail(data);
  }
}
