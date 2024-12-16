import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateHistoryInput {
  @Field()
  capsule_id: string;

  @Field()
  event: string;

  @Field()
  user_id: string;
}
