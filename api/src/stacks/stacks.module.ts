import { Module } from '@nestjs/common';
import { StacksService } from './stacks.service';
import { StacksResolver } from './stacks.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [StacksResolver, StacksService, PrismaService],
})
export class StacksModule {}
