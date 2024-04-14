import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { comparePassword } from '../common/bcrypt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async validateUser(employee_number: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { employee_number },
    });

    const matched = await comparePassword(password, user.password);
    if (user && user.is_active && matched) {
      return user;
    }

    return null;
  }
}
