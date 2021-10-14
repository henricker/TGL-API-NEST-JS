import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BetService } from './bet.service';
import { BetResolver } from './bet.resolver';

@Module({
  providers: [BetService, PrismaService, BetResolver],
})
export class BetModule {}
