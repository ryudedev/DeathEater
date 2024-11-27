import { ObjectType, Field } from '@nestjs/graphql';
import { StackOutput } from './stack.output';
import { UserClassesOutput } from './UserClasses.Output';

@ObjectType()
export class UserDto {
  @Field()
  id: string;

  @Field()
  cognito_id: string;

  @Field()
  email: string;

  @Field()
  lastName: string;

  @Field()
  firstName: string;

  @Field()
  role: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => [StackOutput], { nullable: true })
  stacks?: StackOutput[];

  @Field(() => [UserClassesOutput], { nullable: true })
  userClasses?: UserClassesOutput[];
}
