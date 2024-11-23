import { ObjectType, Field } from '@nestjs/graphql';
import { MediaOutput } from './media.output';

@ObjectType()
export class CapsuleDto {
  @Field()
  id: string;

  @Field()
  class_id: string;

  @Field()
  size: string;

  @Field()
  release_date: Date;

  @Field()
  upload_deadline: Date;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => [MediaOutput], { nullable: true })
  media?: MediaOutput[];
}
