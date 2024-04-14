import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // https://github.com/nestjs/nest/issues/4918
    super({ usernameField: 'employee_number' });
  }

  async validate(employee_number: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(employee_number, password);
    if (!user) {
      throw new UnauthorizedException(
        '社員番号またはパスワードが間違っています',
      );
    }
    return user;
  }
}
