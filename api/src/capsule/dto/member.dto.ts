import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MemberDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  role: string;
}
