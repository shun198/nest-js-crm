import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { comparePassword } from '../common/bcrypt';
import { logInUserDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async validateUser(employee_number: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { employee_number },
    });

    if (user && user.is_active && comparePassword(password, user.password)) {
      const { ...result } = user;
      return result;
    }

    return null;
  }

  async logIn(data: logInUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { employee_number: data.employee_number },
    });
    if (!user) {
      throw new UnauthorizedException(
        '社員番号またはパスワードが間違っています',
      );
    }

    const matched = await comparePassword(data.password, user.password);
    if (!matched) {
      throw new UnauthorizedException(
        '社員番号またはパスワードが間違っています',
      );
    }

    return user;
  }
}
