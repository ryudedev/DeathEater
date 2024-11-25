import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassResolver } from './class.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ClassResolver, ClassService],
  imports: [PrismaModule],
})
export class ClassModule {}
