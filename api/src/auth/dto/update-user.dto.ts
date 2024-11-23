import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  firstName?: string;
}
