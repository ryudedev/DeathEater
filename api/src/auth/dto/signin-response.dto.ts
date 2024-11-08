import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType() // GraphQLのオブジェクト型を定義
export class SignInResponse {
  @Field() // GraphQLでフィールドとして定義
  accessToken: string; // アクセストークンを格納するプロパティ
}
