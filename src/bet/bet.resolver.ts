import { UseGuards } from '@nestjs/common';
import { Mutation, Query } from '@nestjs/graphql';
import { Args, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { Bet } from './bet.entity';
import { BetService } from './bet.service';
import { CreateBetInputDTO } from './dto/create-bet-input.dto';
import { UpdateBetInputDTO } from './dto/update-bet-input.dto';
import { User as UserPrisma } from '.prisma/client';
import { CurrentUser } from 'src/auth/decorators/CurrentUser.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/Roles.decorator';

@Resolver()
@UseGuards(GqlAuthGuard)
export class BetResolver {
  constructor(private service: BetService) {}

  @Query(() => [Bet])
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  public async bets(@CurrentUser() userPrisma: UserPrisma): Promise<Bet[]> {
    const bets = await this.service.find({
      where: { userId: userPrisma.id },
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
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  public async bet(
    @CurrentUser() userPrisma: UserPrisma,
    @Args('betId') betId: number,
  ): Promise<Bet> {
    const bet = await this.service.show(userPrisma.id, betId, {
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
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  public async createBet(
    @CurrentUser() userPrisma: UserPrisma,
    @Args('data') data: CreateBetInputDTO,
  ): Promise<Bet> {
    const bet = await this.service.createBet(userPrisma.id, data);
    return {
      ...bet,
      user: { ...bet['user'] },
      game: { ...bet['game'] },
      numbers: bet.numbers.split(' ').map((number) => Number(number)),
    };
  }

  @Mutation(() => Boolean)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  public async deleteBet(
    @CurrentUser() userPrisma: UserPrisma,
    @Args('betId') betId: number,
  ): Promise<boolean> {
    const deleted = await this.service.deleteBetByUserId(userPrisma.id, betId);
    return deleted;
  }

  @Mutation(() => Bet)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  public async updateBet(
    @CurrentUser() userPrisma: UserPrisma,
    @Args('betId') betId: number,
    @Args('data') data: UpdateBetInputDTO,
  ): Promise<Bet> {
    const betUpdated = await this.service.updateBetByUserId(
      userPrisma.id,
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
