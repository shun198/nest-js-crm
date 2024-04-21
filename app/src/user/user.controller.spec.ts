import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

describe('UsersController', () => {
  let controller: UserController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        PrismaService,
        // https://dev.to/alfism1/build-complete-rest-api-feature-with-nest-js-using-prisma-and-postgresql-from-scratch-beginner-friendly-part-5-1ggd
        {
          provide: EmailService,
          useValue: {
            welcomeEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<UserController>(UserController);
  });

  it('should be defined"', () => {
    expect(controller).toBeDefined();
  });

  describe('users controller', () => {
    // 💡 Test code goes here ...
  });
});
