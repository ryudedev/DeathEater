import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ClassOutput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  school_id: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
