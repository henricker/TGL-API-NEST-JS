import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';

@Module({
  providers: [GameService, PrismaService, GameResolver],
})
export class GameModule {}
