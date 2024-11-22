import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrgInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  registration_number: string;
}
