import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryResolver } from './history.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [HistoryResolver, HistoryService],
  imports: [PrismaModule],
})
export class HistoryModule {}
