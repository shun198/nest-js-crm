import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { comparePassword } from '../common/bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    // https://github.com/nestjs/nest/issues/4918
    super({ usernameField: 'employee_number' });
  }

  async validate(employee_number: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { employee_number },
    });
    const matched = await comparePassword(password, user.password);
    if (user && user.is_active && matched) {
      return user;
    } else if (user && !user.is_active && matched) {
      throw new UnauthorizedException('無効化されたユーザです');
    } else {
      throw new UnauthorizedException(
        '社員番号またはパスワードが間違っています',
      );
    }
  }
}
