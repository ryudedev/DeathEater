import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StackFile {
  @Field() // GraphQLフィールドとして定義
  key: string;

  @Field() // GraphQLフィールドとして定義
  url: string;

  @Field() // GraphQLフィールドとして定義
  type: string;

  @Field() // GraphQLフィールドとして定義
  name: string;

  @Field() // GraphQLフィールドとして定義
  size: number;

  @Field() // GraphQLフィールドとして定義
  category: string;

  @Field()
  uploaded_by: string;

  @Field()
  user_id: string;

  @Field()
  uploadedAt: string;
}
