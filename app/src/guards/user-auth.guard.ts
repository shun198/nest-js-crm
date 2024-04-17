import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.session && request.session.user;
    if (!user) {
      throw new UnauthorizedException(
        'ログインしていないため、この操作を実行する権限がありません',
      );
    }
    return user;
  }
}
