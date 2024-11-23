import { Module } from '@nestjs/common';
import { OrgService } from './org.service';
import { OrgResolver } from './org.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [OrgResolver, OrgService],
  imports: [PrismaModule],
})
export class OrgModule {}
