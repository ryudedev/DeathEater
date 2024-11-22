import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCapsuleInput {
  @Field()
  classId: string;

  @Field()
  size: string;

  @Field()
  releaseDate: Date;

  @Field()
  uploadDeadline: Date;
}
