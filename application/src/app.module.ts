import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from 'common/middleware/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyMailerModule } from './mail/mail.module';
import { MailController } from './mail/mail.controller';
import { MyMailerService } from './mail/mail.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, PrismaModule, MyMailerModule, AuthModule],
  controllers: [UserController, AppController, MailController],
  providers: [UserService, AppService, MyMailerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
