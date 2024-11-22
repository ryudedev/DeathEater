import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CapsuleService } from './capsule.service';
import { CapsuleResolver } from './capsule.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule], // PrismaModule をインポート
  providers: [CapsuleService, CapsuleResolver, PrismaService],
})
export class CapsuleModule {}
