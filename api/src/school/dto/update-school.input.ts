import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateSchoolInput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  address: string;
}
