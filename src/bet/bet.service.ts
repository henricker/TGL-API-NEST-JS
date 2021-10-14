import { Injectable, NotFoundException } from '@nestjs/common';
import { Bet } from '.prisma/client';
import BaseService from '../shared/base.service';
import { CreateBetInputDTO } from './dto/create-bet-input.dto';
import { PrismaService } from '../prisma.service';
import { UpdateBetInputDTO } from './dto/update-bet-input.dto';
import BetBussinessRules from './validator/business-rules.util';

@Injectable()
export class BetService extends BaseService<Bet> {
  constructor(prisma: PrismaService, private businessRules: BetBussinessRules) {
    super(prisma);
  }

  public async createBet(data: CreateBetInputDTO): Promise<Bet> {
    await this.businessRules.validateOnCreate({ ...data });

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
    await this.businessRules.validateOnUpdate({
      userId,
      betId,
      numbers: data.numbers,
    });

    const betUpdated = await this.prisma.bet.update({
      data: {
        ...data,
        numbers: data.numbers?.join(' '),
      },
      where: { id: betId },
      include: { game: true, user: true },
    });

    return betUpdated;
  }
}

type showOptions = {
  include: any;
};
