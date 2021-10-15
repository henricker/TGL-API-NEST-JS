import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class AuthInputDTO {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  password: string;
}
