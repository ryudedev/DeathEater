import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { paymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  //支払を作成するメソッド
  async createPayment(data: {
    amount: number;
    currency: string;
    description: string;
    organization_id: string;
  }): Promise<paymentDto> {
    //Organization が存在するか確認
    const organization = await this.prisma.organization.findUnique({
      where: { id: data.organization_id },
    });

    if (!organization) {
      throw new Error('Invalid organization_id: Organization not found');
    }
    // Prismaを使用してデータベースに新しい支払いを作成
    const payment = await this.prisma.payment.create({
      data: {
        //支払額
        amount: data.amount,
        //現在時刻を支払い日として使用
        payment_date: new Date().toISOString(),
        // 支払いの有効期限（例：1年）
        duration: '1 year',
        // Organization ID
        organization_id: data.organization_id,
      },
    });

    // 作成した支払い情報を返す
    return payment;
  }

  //支払情報を更新するメソッド
  async updatePayment(
    id: string,
    data: {
      amount?: number;
      currency?: string;
      description?: string;
    },
  ): Promise<paymentDto> {
    //支払が存在するかを確認
    const payment = await this.prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found.`);
    }

    //支払情報更新
    const updatePayment = await this.prisma.payment.update({
      where: { id },
      data: {
        amount: data.amount ?? payment.amount,
        updated_at: new Date(),
      },
    });
    return updatePayment;
  }

  //特定の支払い情報を取得するメソッド
  async getPaymentById(id: string): Promise<paymentDto> {
    //Prismaを使用して支払情報を取得
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found.`);
    }
    return payment;
  }

  //全ての支払情報を取得するメソッド
  async getAllPeyment(): Promise<paymentDto[]> {
    //Prismaを使用して全ての支払情報を取得
    return await this.prisma.payment.findMany({
      //支払履歴を作成日時で降順にソート
      orderBy: { created_at: 'desc' },
    });
  }

  //支払情報を削除するメソッド
  async deletePayment(id: string): Promise<void> {
    //支払情報が存在するかを確認
    const payment = await this.prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found.`);
    }
    //支払情報を削除
    await this.prisma.payment.delete({ where: { id } });
  }
}
