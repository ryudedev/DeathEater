import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Org {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  registration_number: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
