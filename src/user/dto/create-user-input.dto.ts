import { Bet } from '.prisma/client';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserInputDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  password: string;
  bets?: Bet[];
}
