import { Module } from '@nestjs/common';
import { CapsuleService } from './capsule.service';
import { CapsuleController } from './capsule.controller';
import { CapsuleResolver } from './capsule.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CapsuleController],
  providers: [CapsuleService, PrismaService, CapsuleResolver], // リゾルバも追加
})
export class CapsuleModule {}
