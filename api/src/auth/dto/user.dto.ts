import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserDto {
  @Field()
  id: string;

  @Field()
  cognito_id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field()
  role: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
