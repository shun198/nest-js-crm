import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../common/localStrategy';

@Module({
  controllers: [AuthController, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
