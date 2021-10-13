import { Game } from '.prisma/client';
import { ConflictException, Injectable } from '@nestjs/common';
import BaseService from '../shared/base.service';
import { PrismaService } from '../prisma.service';
import { CreateGameInputDTO } from './dto/create-game-input.dto';

@Injectable()
export class GameService extends BaseService<Game> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  public async create(data: CreateGameInputDTO): Promise<Game> {
    const gameExists = !!(await this.prisma.game.findUnique({
      where: { type: data.type },
    }));

    if (gameExists)
      throw new ConflictException('error: game type already exists');

    const game = await this.prisma.game.create({ data: data });
    return game;
  }
}
