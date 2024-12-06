import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MemberItemOutput {
  @Field()
  role: string;

  @Field()
  name: string;
}
