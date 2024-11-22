import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Media {
  @Field()
  id: string;

  @Field()
  capsule_id: string;

  @Field()
  file_path: string;

  @Field()
  file_type: string;
}
