import { Field, InputType } from '@nestjs/graphql';
import { MediaInput } from './media.input';

@InputType()
export class UpdateCapsule {
  @Field({ nullable: true })
  class_id?: string; // Prisma の `class_id` に一致

  @Field({ nullable: true })
  size?: string;

  @Field({ nullable: true })
  release_date?: Date;

  @Field({ nullable: true })
  upload_deadline?: Date;

  @Field(() => [MediaInput], { nullable: true })
  media?: MediaInput[];
}
