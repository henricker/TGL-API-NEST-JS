import { Injectable, NotFoundException } from '@nestjs/common';
import { Bet } from '.prisma/client';
import BaseService from 'src/shared/base.service';
import { CreateBetInputDTO } from './dto/create-bet-input.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BetService extends BaseService<Bet> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  public async create(data: CreateBetInputDTO): Promise<Bet> {
    const existsUser = !!(await this.prisma.user.findUnique({
      where: { id: data.userId },
    }));

    if (!existsUser) throw new NotFoundException('error: user not found');

    const existsGame = !!(await this.prisma.game.findUnique({
      where: { id: data.gameId },
    }));

    if (!existsGame) throw new NotFoundException('error: game not found');

    const bet = await this.prisma.bet.create({ data });

    return bet;
  }
}
