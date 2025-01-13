import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Media {
  @Field(() => ID)
  id: string;

  @Field()
  capsule_id: string;

  @Field()
  file_path: string;

  @Field()
  file_type: string;

  @Field()
  uploaded_by: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
