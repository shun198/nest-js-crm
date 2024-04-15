import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  Scope,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { EmailService } from '../email/email.service';
import { InviteUserDto } from './dto/inviteUser.dto';
import { comparePassword, encodePassword } from '../common/bcrypt';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CheckTokenDto } from './dto/checkToken.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ChangeUserDetailsDto } from './dto/changeUserDetails.dto';

// https://stackoverflow.com/questions/54979729/howto-get-req-user-in-services-in-nest-js
// https://docs.nestjs.com/fundamentals/injection-scopes#request-provider

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    @Inject(REQUEST) private request: Request,
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
      role: user.role,
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async user_info() {
    if (this.request.session['user']) {
      const user = await this.prismaService.user.findUnique({
        where: { id: this.request.session['user'].id },
      });
      return user;
    }
    return null;
  }

  async toggle_user_active(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`ID:${id}を持つユーザは存在しません`);
    }
    if (user.id === this.request.session['user'].id) {
      throw new BadRequestException('自身を無効化することはできません');
    }
    await this.prismaService.user.update({
      where: { id },
      data: {
        is_active: !user.is_active,
      },
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
    const password = await encodePassword(data.password);
    data.password = password;
    await this.prismaService.user.create({ data });
  }

  async change_user_details(id: number, data: ChangeUserDetailsDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundException(`ID:${id}を持つユーザは存在しません`);
    }
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: data,
    });
    return updatedUser;
  }

  async send_invite_user_email(data: InviteUserDto) {
    const existingEmailUser = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existingEmailUser && existingEmailUser.is_verified) {
      throw new BadRequestException('認証済みのユーザです');
    }
    // ユーザを作成する
    // const user = this.prismaService.user.create({ data });
    // トークンを生成する処理をメール送信前に記載する
    this.emailService.welcomeEmail(data);
  }

  async resend_invitation(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`ID:${id}を持つユーザは存在しません`);
    }
    // this.emailService.welcomeEmail(user.email);
  }

  async verify_user(data: VerifyUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { employee_number: data.employee_number },
    });
    if (user) {
      const matched = await comparePassword(data.password, user.password);
      if (!matched) {
        throw new BadRequestException(
          '社員番号またはパスワードが間違っています',
        );
      }
    } else {
      throw new BadRequestException('社員番号またはパスワードが間違っています');
    }
  }

  async change_password(data: ChangePasswordDto) {
    if (data.password !== data.confirm_password) {
      throw new BadRequestException(
        '新しいパスワードと確認用パスワードが一致していません',
      );
    }
    //requestからユーザを取得し、ユーザとパスワードが一致していなかったら400を返す処理を書く
    //一致したことを確認できたらパスワードを変更する
    await this.prismaService.user.update({
      where: { id: this.request.session['user'].id },
      data: {
        password: await encodePassword(data.password),
      },
    });
  }

  async check_invite_user_token(data: CheckTokenDto) {
    // tokenの値から一致するUserを取得。なかったら400を返す
    // select_relatedを使って取得する
    // 有効期限が切れている、もしくは使用フラグがtrueだったら400を返す
    const check = data.token;
    if (!check) {
      return null;
    }
    return check;
  }

  async check_reset_password_token(data: CheckTokenDto) {
    // tokenの値から一致するUserを取得。なかったら400を返す
    // select_relatedを使って取得する
    // 有効期限が切れている、もしくは使用フラグがtrueだったら400を返す
    const check = data.token;
    if (!check) {
      return null;
    }
    return check;
  }
}
