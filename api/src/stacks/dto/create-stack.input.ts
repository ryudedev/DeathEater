import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateStackInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
