import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MemberListDto {
  @Field(() => [String])
  admin: string[];

  @Field(() => [String])
  subleaders: string[];

  @Field(() => [String])
  members: string[];
}
