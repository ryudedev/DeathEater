import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HistoryOutput {
  @Field()
  id: string;

  @Field()
  capsule_id: string;

  @Field()
  event: string;

  @Field()
  user_id: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
