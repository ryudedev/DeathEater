import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CapsuleDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  class_id: string;

  @Field()
  size: string;

  @Field()
  release_date: Date;

  @Field()
  url: string;

  @Field()
  upload_deadline: Date;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
