import { Module } from '@nestjs/common';
import { CapsuleService } from './capsule.service';
import { CapsuleResolver } from './capsule.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CapsuleService, CapsuleResolver, PrismaService],
})
export class CapsuleModule {}
