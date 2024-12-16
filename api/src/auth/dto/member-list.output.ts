import { Field, ObjectType } from '@nestjs/graphql';
import { UserClassesOutput } from './UserClasses.Output';

@ObjectType()
export class MemberListOutput {
  @Field(() => [UserClassesOutput]) // 配列であることを指定
  admins: UserClassesOutput[];

  @Field(() => [UserClassesOutput]) // 配列であることを指定
  leaders: UserClassesOutput[];

  @Field(() => [UserClassesOutput]) // 配列であることを指定
  members: UserClassesOutput[];
}
