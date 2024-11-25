import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class MediaStatsDto {
  @Field()
  image: number;

  @Field()
  video: number;

  @Field()
  audio: number;

  @Field()
  text: number;
}

@ObjectType()
export class CapsuleDetailsDto {
  @Field()
  id: string;

  @Field()
  release_date: Date;

  @Field()
  upload_deadline: Date;

  @Field()
  size: string;

  @Field(() => MediaStatsDto) // メディア統計を持つサブタイプ
  mediaStats: MediaStatsDto;

  // classId が必要なら追加
  @Field({ nullable: true })
  class_id?: string;
}
