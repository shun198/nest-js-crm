import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  Scope,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { InviteUserDto } from './dto/inviteUser.dto';
import { encodePassword } from '../common/bcrypt';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CheckTokenDto } from './dto/checkToken.dto';
import { REQUEST } from '@nestjs/core';
import { ChangeUserDetailsDto } from './dto/changeUserDetails.dto';
import { SendResetPasswordMailDto } from './dto/sendResetPasswordMail.dto';
import { generate_token } from '../common/create-token';
import { ResetPasswordDto } from './dto/resetPassword.dto';

// https://stackoverflow.com/questions/54979729/howto-get-req-user-in-services-in-nest-js
// https://docs.nestjs.com/fundamentals/injection-scopes#request-provider

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    @Inject(REQUEST) private request,
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
      is_verified: user.is_verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async user_info() {
    if (this.request.session.user.id) {
      const user = await this.prismaService.user.findUnique({
        where: { id: this.request.session.user.id },
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
    if (user.id === this.request.session.user.id) {
      throw new BadRequestException('自身を無効化することはできません');
    }
    await this.prismaService.user.update({
      where: { id },
      data: {
        is_active: !user.is_active,
      },
    });
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

  // 後でtransactionを追加する
  // https://www.prisma.io/docs/orm/prisma-client/queries/transactions
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
    const updatedData = {
      ...data,
      password: generate_token(32),
    };
    const user = await this.prismaService.user.create({ data: updatedData });
    // トークンを生成する
    const token: string = generate_token(32);
    const now: Date = new Date();
    const expiry: Date = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    await this.prismaService.invitation.create({
      data: {
        token,
        expiry,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    const url = `${process.env.BASE_URL}/password/register/${token}`;
    this.emailService.welcomeEmail(user.email, url, user.name, expiry);
  }

  async resend_invitation(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`ID:${id}を持つユーザは存在しません`);
    }
    // トークンを生成する
    const token: string = generate_token(32);
    const url = `${process.env.BASE_URL}/password/register/${token}`;
    console.log(url);
    // this.emailService.welcomeEmail(user.email, url, user.name, expiry);
  }

  async verify_user(data: VerifyUserDto) {
    console.log(data);
    // 招待トークンが存在するか、トークンの有効期限を確認する
    // パスワードを設定する
    // is_verified=Trueにする, is_used=Trueにする
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
      where: { id: this.request.session.user.id },
      data: {
        password: await encodePassword(data.password),
      },
    });
  }

  async send_reset_password_mail(data: SendResetPasswordMailDto) {
    // トークンを生成する
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!existingUser) {
      throw new NotFoundException(
        '該当するメールアドレスのユーザは存在しません',
      );
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });
    const token: string = generate_token(32);
    const now: Date = new Date();
    const expiry: Date = new Date(now.getTime() + 0.5 * 60 * 60 * 1000);
    await this.prismaService.passwordReset.create({
      data: {
        token,
        expiry,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    const url = `${process.env.BASE_URL}/password/reset/${token}`;
    this.emailService.resetPasswordEmail(user.email, url, user.name, expiry);
  }

  async reset_password(data: ResetPasswordDto) {
    console.log(data);
    // パスワード再設定トークンの確認
    // パスワードを再設定
    // is_usedをTrueにする
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
