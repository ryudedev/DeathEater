import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SchoolResponse {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  organization_id: string;

  @Field()
  school_registration_number: string;

  @Field()
  address: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
