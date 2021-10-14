import { Injectable, NotFoundException } from '@nestjs/common';
import { Bet } from '.prisma/client';
import BaseService from '../shared/base.service';
import { CreateBetInputDTO } from './dto/create-bet-input.dto';
import { PrismaService } from '../prisma.service';
import { UpdateBetInputDTO } from './dto/update-bet-input.dto';

@Injectable()
export class BetService extends BaseService<Bet> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  public async createBet(data: CreateBetInputDTO): Promise<Bet> {
    const existsUser = !!(await this.prisma.user.findUnique({
      where: { id: data.userId },
    }));

    if (!existsUser) throw new NotFoundException('error: user not found');

    const existsGame = !!(await this.prisma.game.findUnique({
      where: { id: data.gameId },
    }));

    if (!existsGame) throw new NotFoundException('error: game not found');

    const bet = await this.prisma.bet.create({
      data: {
        ...data,
        numbers: data.numbers.join(' '),
      },
      include: { user: true, game: true },
    });

    await this.prisma.user.update({
      where: { id: data.userId },
      data: { lastBet: new Date() },
    });

    return bet;
  }

  public async show(
    userId: number,
    betId: number,
    options?: showOptions,
  ): Promise<Bet> {
    const bet = await this.prisma.bet.findFirst({
      where: { userId, id: betId },
      include: options?.include,
    });

    if (!bet) throw new NotFoundException('error: bet not found');

    return bet;
  }

  public async deleteBetByUserId(
    userId: number,
    betId: number,
  ): Promise<boolean> {
    const bet = await this.show(userId, betId);
    const deleted = !!(await this.prisma.bet.delete({ where: { id: bet.id } }));
    return deleted;
  }

  public async updateBetByUserId(
    userId: number,
    betId: number,
    data: UpdateBetInputDTO,
  ): Promise<Bet> {
    const bet = await this.show(userId, betId);
    const betUpdated = await this.prisma.bet.update({
      data,
      where: { id: bet.id },
      include: { game: true, user: true },
    });

    return betUpdated;
  }
}

type showOptions = {
  include: any;
};
