import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CapsuleDto {
  @Field()
  id: string;

  @Field()
  classId: string;

  @Field()
  size: string;

  @Field()
  releaseDate: Date;

  @Field()
  uploadDeadline: Date;
}
