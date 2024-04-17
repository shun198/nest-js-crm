import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.session && request.session.user;
    // https://stackoverflow.com/questions/75004427/how-to-throw-error-using-nest-js-guards-without-using-any-authentication-module
    if (!user) {
      throw new UnauthorizedException(
        'ログインしていないため、この操作を実行する権限がありません',
      );
    }
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(
        '管理者ユーザではないため、この操作を実行する権限がありません',
      );
    }
    return user;
  }
}
