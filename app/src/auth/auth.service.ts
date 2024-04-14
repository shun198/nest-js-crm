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

    if (user && user.is_active && comparePassword(password, user.password)) {
      const { ...result } = user;
      return result;
    }

    return null;
  }
}
