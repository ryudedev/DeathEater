import { Module } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { PaymentResolver } from './payments.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PaymentService, PaymentResolver, PrismaService],
})
export class PaymentsModule {}
