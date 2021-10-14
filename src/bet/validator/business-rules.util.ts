import { Game } from '.prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

type validateOnCreate = {
  gameId: number;
  userId: number;
  numbers: number[];
};

type validateOnUpdate = {
  userId: number;
  betId: number;
  numbers: number[];
};

@Injectable()
export default class BetBussinessRules {
  constructor(private prisma: PrismaService) {}

  public async validateOnCreate({
    gameId,
    userId,
    numbers,
  }: validateOnCreate): Promise<void> {
    const gameExists = await this.prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!gameExists) throw new NotFoundException('error: game not found');

    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) throw new NotFoundException('error: user not found');

    this.validateBet(numbers, gameExists);
  }

  public async validateOnUpdate({
    userId,
    betId,
    numbers,
  }: validateOnUpdate): Promise<void> {
    const bet = await this.prisma.bet.findFirst({
      where: { userId, id: betId },
    });

    if (!bet) throw new NotFoundException('error: bet not found');

    const game = await this.prisma.game.findUnique({
      where: { id: bet.gameId },
    });

    if (!game) throw new NotFoundException('error: game not found');

    this.validateBet(numbers, game);
  }

  private validateBet(numbers: number[], game: Game): void {
    if (numbers.length !== game.maxNumber)
      throw new BadRequestException(
        `error: bet must be at most ${game.maxNumber} numbers`,
      );

    if (!numbers.every((value) => value >= 1 && value <= game.range))
      throw new BadRequestException(
        `error: bet must be have numbers betwen 1 and ${game.range}`,
      );

    const uniqueNumbers = Array.from(new Set(numbers).values());

    if (
      !(
        uniqueNumbers.reduce((prev, next) => prev + next) ==
        numbers.reduce((prev, next) => prev + next)
      )
    )
      throw new BadRequestException(`error: must be unique numbers in array`);
  }
}
