import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import BusinessRulesGame from './validator/business-game.rule';

@Module({
  providers: [GameService, PrismaService, GameResolver, BusinessRulesGame],
})
export class GameModule {}
