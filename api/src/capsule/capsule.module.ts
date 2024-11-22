import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CapsuleService } from './capsule.service';
import { CapsuleResolver } from './capsule.resolver';

@Module({
  imports: [PrismaModule], // PrismaModule をインポート
  providers: [CapsuleService, CapsuleResolver], // PrismaService をここで直接登録しない
})
export class CapsuleModule {}
