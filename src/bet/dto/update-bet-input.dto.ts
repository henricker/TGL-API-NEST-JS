import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@InputType()
export class UpdateBetInputDTO {
  @Field(() => [Int])
  @IsArray()
  numbers: number[];
}
