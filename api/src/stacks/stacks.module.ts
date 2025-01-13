import { Module } from '@nestjs/common';
import { StacksService } from './stacks.service';
import { StacksResolver } from './stacks.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [StacksResolver, StacksService, PrismaService, AuthService],
})
export class StacksModule {}
