import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MediaInput {
  @Field()
  id: string;

  @Field()
  capsule_id: string;

  @Field()
  file_path: string;

  @Field()
  file_type: string;
}
