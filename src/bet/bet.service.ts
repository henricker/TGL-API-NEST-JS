import { Injectable, NotFoundException } from '@nestjs/common';
import { Bet } from '.prisma/client';
import BaseService from '../shared/base.service';
import { CreateBetInputDTO } from './dto/create-bet-input.dto';
import { PrismaService } from '../prisma.service';
import { UpdateBetInputDTO } from './dto/update-bet-input.dto';
import BetBussinessRules from './validator/business-rules.util';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class BetService extends BaseService<Bet> {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'user-consumer',
        allowAutoTopicCreation: true,
      },
    },
  })
  private clientKafka: ClientKafka;

  constructor(prisma: PrismaService, private businessRules: BetBussinessRules) {
    super(prisma);
  }

  public async createBet(
    userId: number,
    data: CreateBetInputDTO,
  ): Promise<Bet> {
    await this.businessRules.validateOnCreate(userId, { ...data });

    const bet = await this.prisma.bet.create({
      data: {
        userId,
        numbers: data.numbers.join(' '),
        gameId: data.gameId,
      },
      include: { user: true, game: true },
    });

    const betsPlaced = [
      { game: bet.game.type, color: bet.game.color, numbers: bet.numbers },
    ];
    this.clientKafka.emit('mailer-event', {
      contact: {
        name: bet.user.name,
        email: bet.user.email,
      },
      bets: {
        totalPrice: bet.game.price,
        arrayBets: betsPlaced,
      },
      template: 'new-bets-user',
    }),
      await this.prisma.user.update({
        where: { id: userId },
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
