// src/orders/dto/create-order.input.ts

import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { CapsuleSize } from '@prisma/client';
import { IsEnum, IsInt, Min } from 'class-validator';

registerEnumType(CapsuleSize, {
  name: 'CapsuleSize', // GraphQL スキーマ上の名前
  description: 'Available sizes for a capsule', // 必要に応じて説明を追加
});

@InputType()
export class CreateOrderInput {
  @Field(() => CapsuleSize)
  @IsEnum(CapsuleSize)
  capsule_size: CapsuleSize;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  storage_years: number;

  @Field(() => String)
  // Stripeのトークンなど必要な情報を追加
  stripe_token: string;

  @Field(() => String)
  user_id: string;
}
