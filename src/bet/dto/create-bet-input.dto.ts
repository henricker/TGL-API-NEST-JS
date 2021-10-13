import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBetInputDTO {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  gameId: number;
}
