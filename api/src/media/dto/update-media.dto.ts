import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateMediaDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  capsule_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  file_path?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  file_type?: string;
}
