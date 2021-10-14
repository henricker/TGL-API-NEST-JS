import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

@InputType()
export class CreateGameInputDTO {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  type: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  range: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  maxNumber: number;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Field(() => String)
  @Matches(/^#([0-9A-F]{3}){1,2}$/i)
  color: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  minCartValue: number;
}
