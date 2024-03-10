// prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 他のモジュールでもPrismaServiceを利用できるようにexportする
})
export class PrismaModule {}
