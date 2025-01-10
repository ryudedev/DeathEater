// src/orders/orders.service.ts

import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  calculateTotal(capsuleSize: string, storageYears: number): number {
    const capsulePrices = {
      SMALL: 9000,
      MEDIUM: 15000,
      LARGE: 21000,
    };
    const storagePricePerYear = 3000;
    return capsulePrices[capsuleSize] + storagePricePerYear * storageYears;
  }

  async create(createOrderInput: CreateOrderInput) {
    const { capsule_size, storage_years, stripe_token, user_id } =
      createOrderInput;
    const total_amount = this.calculateTotal(capsule_size, storage_years);
    // StripeでCharge作成
    const charge = await this.stripe.charges.create({
      amount: total_amount,
      currency: 'jpy',
      source: stripe_token,
      description: `Order for ${capsule_size} capsule and ${storage_years} years storage`,
    });
    // 注文をデータベースに保存
    const order = await this.prisma.order.create({
      data: {
        user_id: user_id,
        capsule_size,
        storage_years,
        total_amount,
        stripe_charge_id: charge.id,
      },
    });
    return order;
  }

  // src/orders/orders.service.ts （追加）

  async createCheckoutSession(createOrderInput: CreateOrderInput) {
    const { capsule_size, storage_years } = createOrderInput;
    const total_amount = this.calculateTotal(capsule_size, storage_years);

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `カプセルサイズ: ${capsule_size}, 保管期間: ${storage_years}年`,
            },
            unit_amount: total_amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return session.url;
  }
}
