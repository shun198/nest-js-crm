import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private prismaService: PrismaService) {
    super();
  }

  serializeUser(user: User, done: (err: Error, id: number) => void): void {
    done(null, user.id);
  }

  async deserializeUser(
    id: number,
    done: (err: Error, user: User | null) => void,
  ): Promise<void> {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    done(null, user);
  }
}
