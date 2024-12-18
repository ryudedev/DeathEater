import { Field, ObjectType } from '@nestjs/graphql';
import { ClassOutput } from 'src/class/dto/class.output';
import { UserDto } from './user.dto';

@ObjectType()
export class UserClassesOutput {
  @Field()
  id: string;

  @Field()
  user_id: string;

  @Field()
  class_id: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => ClassOutput, { nullable: true })
  class?: ClassOutput;

  @Field(() => UserDto, { nullable: true })
  user?: UserDto;
}
