import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MediaFile {
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

  @Field(() => Boolean) // GraphQLフィールドとして定義
  deletable: boolean;

  @Field()
  uploaded_by: string;

  @Field()
  uploadedAt: string;
}
