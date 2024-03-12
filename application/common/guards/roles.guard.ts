import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredGroups = this.reflector.getAllAndOverride<string[]>(
      'groups',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredGroups) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { groups: true },
    });

    if (!user) {
      return false;
    }

    const userGroups = user.groups.map((groups) => groups.name);

    const hasGroup = () =>
      userGroups.some((groups) => requiredGroups.includes(groups));

    if (!hasGroup()) {
      throw new ForbiddenException('権限がありません');
    }

    return true;
  }
}
