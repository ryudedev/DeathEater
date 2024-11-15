import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CapsuleContentDto {
  @Field()
  id: string;

  @Field()
  file_path: string;

  @Field()
  file_type: string; // ファイルタイプ（例：動画、音声、画像）
}
