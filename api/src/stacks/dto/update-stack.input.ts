import { CreateStackInput } from './create-stack.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStackInput extends PartialType(CreateStackInput) {
  @Field(() => Int)
  id: number;
}
