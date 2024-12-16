import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class paymentDto {
  @Field(() => ID)
  id: string;

  @Field()
  organization_id: string;

  @Field()
  amount: number;

  @Field()
  payment_date: string;

  @Field()
  duration: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
