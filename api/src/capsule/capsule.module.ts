import { Module } from '@nestjs/common';
import { CapsuleService } from './capsule.service';
import { CapsuleResolver } from './capsule.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [CapsuleService, CapsuleResolver, PrismaService],
  imports: [PrismaModule],
})
export class CapsuleModule {}
