import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { BetModule } from './bet/bet.module';

@Module({
  imports: [UserModule, GameModule, BetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
