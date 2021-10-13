import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserInputDTO {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;
}
