import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateOrgInput {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  address: string;
}
