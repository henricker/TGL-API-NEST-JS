import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateGameInputDTO } from './dto/create-game-input.dto';
import { UpdateGameInputDTO } from './dto/update-game-input.dto';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Resolver()
export class GameResolver {
  constructor(private service: GameService) {}

  @Query(() => Game)
  async game(@Args('id') id: number): Promise<Game> {
    const game = await this.service.findByUniqueKey('id', id);
    return { ...game };
  }

  @Query(() => [Game])
  async games(): Promise<Game[]> {
    const games = await this.service.find();
    return games;
  }

  @Mutation(() => Game)
  async createGame(@Args('data') data: CreateGameInputDTO): Promise<Game> {
    const game = await this.service.create(data);
    return { ...game };
  }

  @Mutation(() => Game)
  async updateGame(
    @Args('id') id: number,
    @Args('data') data: UpdateGameInputDTO,
  ): Promise<Game> {
    const game = await this.service.update(id, data);
    return { ...game };
  }

  @Mutation(() => Boolean)
  async deleteGame(@Args('id') id: number): Promise<boolean> {
    const deleted = await this.service.delete(id);
    return deleted;
  }
}
