import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCapsuleInput {
  @Field()
  class_id: string;

  @Field()
  size: string;

  @Field()
  release_date: Date;

  @Field()
  upload_deadline: Date;
}
