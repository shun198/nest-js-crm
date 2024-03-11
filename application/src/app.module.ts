import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from 'common/logger.middleware';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
