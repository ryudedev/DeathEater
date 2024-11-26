import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

enum Role {
  ROOT = 'ROOT',
  ADMIN = 'ADMIN',
  LEADER = 'LEADER',
  MEMBER = 'MEMBER',
}

@InputType()
export class AuthDto {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  lastName: string;

  @Field()
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @Field()
  @IsNotEmpty()
  @IsString()
  cognito_id: string;
}
