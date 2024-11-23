import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateClassInput {
  @Field()
  id: string;

  @Field()
  name: string;
}
