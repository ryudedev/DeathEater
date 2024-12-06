import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolResolver } from './school.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SchoolResolver, SchoolService],
  imports: [PrismaModule],
})
export class SchoolModule {}
