import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StackOutput {
  @Field()
  id: string;

  @Field()
  capsule_id: string;

  @Field()
  file_path: string;

  @Field()
  uploaded_by: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
