import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from 'src/auth/dto/user.dto';

@ObjectType()
export class HistoryOutput {
  @Field()
  id: string;

  @Field()
  capsule_id: string;

  @Field({ nullable: true })
  history_id?: string;

  @Field()
  event: string;

  @Field()
  user_id: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => UserDto, { nullable: true })
  user?: UserDto;
}
