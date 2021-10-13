import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateGameInputDTO {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  range: number;

  @IsInt()
  @IsNotEmpty()
  maxNumber: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Matches(/^#([0-9A-F]{3}){1,2}$/i)
  color: string;

  @IsInt()
  @IsNotEmpty()
  minCartValue: number;
}
