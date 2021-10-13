import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GameService } from './game.service';

@Module({
  providers: [GameService, PrismaService],
})
export class GameModule {}
