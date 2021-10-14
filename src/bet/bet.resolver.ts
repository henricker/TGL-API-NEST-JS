import { Mutation, Query } from '@nestjs/graphql';
import { Args, Resolver } from '@nestjs/graphql';
import { Bet } from './bet.entity';
import { BetService } from './bet.service';
import { CreateBetInputDTO } from './dto/create-bet-input.dto';
import { UpdateBetInputDTO } from './dto/update-bet-input.dto';

@Resolver()
export class BetResolver {
  constructor(private service: BetService) {}

  @Query(() => [Bet])
  public async bets(@Args('userId') userId: number): Promise<Bet[]> {
    const bets = await this.service.find({
      where: { userId },
      include: { user: true, game: true },
    });

    const betsSchema = bets.map((bet) => ({
      ...bet,
      user: { ...bet['user'] },
      game: { ...bet['game'] },
      numbers: bet.numbers.split(' ').map((number) => Number(number)),
    }));

    return betsSchema;
  }

  @Query(() => Bet)
  public async bet(
    @Args('userId') userId: number,
    @Args('betId') betId: number,
  ): Promise<Bet> {
    const bet = await this.service.show(userId, betId, {
      include: { user: true, game: true },
    });
    return {
      ...bet,
      user: { ...bet['user'] },
      game: { ...bet['game'] },
      numbers: bet.numbers.split(' ').map((number) => Number(number)),
    };
  }

  @Mutation(() => Bet)
  public async createBet(@Args('data') data: CreateBetInputDTO): Promise<Bet> {
    const bet = await this.service.createBet(data);
    return {
      ...bet,
      user: { ...bet['user'] },
      game: { ...bet['game'] },
      numbers: bet.numbers.split(' ').map((number) => Number(number)),
    };
  }

  @Mutation(() => Boolean)
  public async deleteBet(
    @Args('userId') userId: number,
    @Args('betId') betId: number,
  ): Promise<boolean> {
    const deleted = await this.service.deleteBetByUserId(userId, betId);
    return deleted;
  }

  @Mutation(() => Bet)
  public async updateBet(
    @Args('userId') userId: number,
    @Args('betId') betId: number,
    @Args('data') data: UpdateBetInputDTO,
  ): Promise<Bet> {
    const betUpdated = await this.service.updateBetByUserId(
      userId,
      betId,
      data,
    );

    return {
      ...betUpdated,
      user: { ...betUpdated['user'] },
      game: { ...betUpdated['game'] },
      numbers: betUpdated.numbers.split(' ').map((number) => Number(number)),
    };
  }
}
