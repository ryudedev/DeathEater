import { ObjectType, Field } from '@nestjs/graphql';
import { StackOutput } from './stack.output';
import { UserClassesOutput } from './UserClasses.Output';
import { Media } from 'src/media/dto/media.output';

@ObjectType()
export class UserDto {
  @Field()
  id: string;

  @Field()
  cognito_id: string;

  @Field({ nullable: true })
  avatar?: string;

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

  @Field(() => [Media], { nullable: true })
  medias?: Media[];

  @Field(() => [UserClassesOutput], { nullable: true })
  userClasses?: UserClassesOutput[];
}
