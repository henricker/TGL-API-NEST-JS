import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BetService } from './bet.service';
import { BetResolver } from './bet.resolver';
import BetBussinessRules from './validator/business-rules.util';

@Module({
  providers: [BetService, PrismaService, BetResolver, BetBussinessRules],
})
export class BetModule {}
