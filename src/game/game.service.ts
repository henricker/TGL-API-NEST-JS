import { Game } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import BaseService from '../shared/base.service';
import { PrismaService } from '../prisma.service';
import { CreateGameInputDTO } from './dto/create-game-input.dto';
import BusinessRulesGame from './validator/business-game.rule';

@Injectable()
export class GameService extends BaseService<Game> {
  constructor(prisma: PrismaService, private businessRules: BusinessRulesGame) {
    super(prisma);
  }

  public async create(data: CreateGameInputDTO): Promise<Game> {
    await this.businessRules.validateCreate({ type: data.type });

    const game = await this.prisma.game.create({ data });
    return game;
  }
}
