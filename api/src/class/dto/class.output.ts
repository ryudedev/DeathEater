import { Field, ObjectType } from '@nestjs/graphql';
import { CapsuleDto } from 'src/capsule/dto/capsule.dto';
import { SchoolResponse } from 'src/school/dto/school.response';

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

  @Field(() => [CapsuleDto], { nullable: true })
  capsules?: CapsuleDto[];

  @Field(() => SchoolResponse, { nullable: true })
  school?: SchoolResponse;
}
