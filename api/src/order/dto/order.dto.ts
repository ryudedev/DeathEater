import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CapsuleSize } from '@prisma/client';

@ObjectType()
export class Order {
  @Field(() => String)
  id: string;

  @Field(() => String)
  user_id: string;

  @Field(() => CapsuleSize)
  capsule_size: CapsuleSize;

  @Field(() => Int)
  storage_years: number;

  @Field(() => Int)
  total_amount: number;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Field(() => String, { nullable: true })
  organizationId?: string;
}
