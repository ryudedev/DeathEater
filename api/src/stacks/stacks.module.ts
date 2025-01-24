import { Module } from '@nestjs/common';
import { StacksService } from './stacks.service';
import { StacksResolver } from './stacks.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  providers: [
    StacksResolver,
    StacksService,
    PrismaService,
    AuthService,
    HistoryService,
  ],
})
export class StacksModule {}
