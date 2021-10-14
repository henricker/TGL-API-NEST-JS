import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateBetInputDTO {
  @Field(() => String)
  @IsOptional()
  @IsString()
  numbers?: string;
}
