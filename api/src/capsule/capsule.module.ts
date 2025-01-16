import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CapsuleService } from './capsule.service';
import { CapsuleResolver } from './capsule.resolver';
import { CapsuleGateway } from './capsule.gateway';

@Module({
  imports: [PrismaModule], // PrismaModule をインポート
  providers: [CapsuleService, CapsuleResolver, CapsuleGateway], // PrismaService をここで直接登録しない
})
export class CapsuleModule {}
