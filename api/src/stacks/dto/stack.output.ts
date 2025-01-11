import { ObjectType, Field } from '@nestjs/graphql';
import { UserDto } from 'src/auth/dto/user.dto';
import { CapsuleDto } from 'src/capsule/dto/capsule.dto';

@ObjectType()
export class Stack {
  @Field()
  id: string;

  @Field()
  capsule_id: string;

  @Field()
  file_path: string;

  @Field()
  uploaded_by: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => CapsuleDto) // Capsule の型が必要
  capsule: CapsuleDto;

  @Field(() => UserDto) // User の型が必要
  user: UserDto;
}
