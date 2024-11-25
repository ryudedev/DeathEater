import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSchoolInput {
  @Field()
  name: string;

  @Field()
  organization_id: string;

  @Field()
  school_registration_number: string;

  @Field()
  address: string;
}
