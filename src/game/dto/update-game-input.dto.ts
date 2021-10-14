import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

@InputType()
export class UpdateGameInputDTO {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  range?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  maxNumber?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  price?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Matches(/^#([0-9A-F]{3}){1,2}$/i)
  color?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  minCartValue?: number;
}
