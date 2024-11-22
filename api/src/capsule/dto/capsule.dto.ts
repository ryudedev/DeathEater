import { ObjectType, Field } from '@nestjs/graphql';
import { Media } from './media.dto';

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

  @Field(() => [Media], { nullable: true })
  media?: Media[];
}
