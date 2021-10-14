import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Game } from '../game/game.entity';
import { User } from '../user/user.entity';

@ObjectType()
export class Bet {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  gameId: number;

  @Field(() => User)
  user: User;

  @Field(() => Game)
  game: Game;

  @Field(() => [Int])
  numbers: number[];
}
