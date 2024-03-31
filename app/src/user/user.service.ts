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
import { comparePassword, encodePassword } from 'src/common/bcrypt';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CheckTokenDto } from './dto/checkToken.dto';

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
    const password = await encodePassword(data.password);
    data.password = password;
    await this.prismaService.user.create({ data });
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
    // トークンを生成する処理をメール送信前に記載する
    this.emailService.welcomeEmail(data);
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
    //ユーザを取得し、ユーザとパスワードが一致していなかったら400を返す処理を書く
    //一致したことを確認できたらパスワードを変更する
  }

  async resend_invitation(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`ID:${id}を持つユーザは存在しません`);
    }
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
