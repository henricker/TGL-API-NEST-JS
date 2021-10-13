import { Module } from '@nestjs/common';
import { BetService } from './bet.service';

@Module({
  providers: [BetService],
})
export class BetModule {}
