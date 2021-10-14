import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateBetInputDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  gameId: number;

  @Field(() => [Int])
  @IsArray()
  numbers: number[];
}
