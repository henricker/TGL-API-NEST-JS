import { Bet } from '.prisma/client';
import { CreateBetInputDTO } from 'src/bet/dto/create-bet-input.dto';

export const fakeNewBet: CreateBetInputDTO = {
  gameId: 1,
  userId: 1,
};

export const fakeBetEntity: Bet = {
  id: 1,
  gameId: 1,
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};
