import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BetService } from './bet.service';

@Module({
  providers: [BetService, PrismaService],
})
export class BetModule {}
