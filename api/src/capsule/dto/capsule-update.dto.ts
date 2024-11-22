import { Field, InputType } from '@nestjs/graphql';
import { Media } from './media.dto';

@InputType()
export class UpdateCapsuleDto {
  @Field({ nullable: true })
  class_id?: string; // Prisma の `class_id` に一致

  @Field({ nullable: true })
  size?: string;

  @Field({ nullable: true })
  release_date?: Date;

  @Field({ nullable: true })
  upload_deadline?: Date;

  @Field(() => [Media], { nullable: true })
  media?: Media[];
}
