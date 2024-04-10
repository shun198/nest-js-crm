import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/common/bcrypt';
import { logInUserDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async logIn(data: logInUserDto): Promise<{ access_token: string }> {
    const user = await this.prismaService.user.findUnique({
      where: { employee_number: data.employee_number },
    });
    if (user) {
      const matched = await comparePassword(data.password, user.password);
      if (!matched) {
        throw new UnauthorizedException(
          '社員番号またはパスワードが間違っています',
        );
      }
    } else {
      throw new UnauthorizedException(
        '社員番号またはパスワードが間違っています',
      );
    }
    const payload = { sub: user.id, employee_number: user.employee_number };
    console.log(payload);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
