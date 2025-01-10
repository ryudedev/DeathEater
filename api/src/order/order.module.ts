import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [OrderResolver, OrderService],
  imports: [PrismaModule],
})
export class OrderModule {}
