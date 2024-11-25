import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateClassInput {
  @Field()
  name: string;

  @Field()
  school_id: string;
}
