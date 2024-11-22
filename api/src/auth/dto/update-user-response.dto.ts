import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateUserResponse {
  @Field()
  id: string;

  @Field()
  email: string;
}
