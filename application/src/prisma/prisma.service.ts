import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService {
  readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  // prismaを実行した時のSQLを確認できる
  // constructor() {
  //   this.prisma = new PrismaClient({
  //     log: ['query'],
  //   });
  // }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  get user() {
    return this.prisma.user;
  }
}
