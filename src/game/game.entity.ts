import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Game {
  @Field(() => ID)
  id: number;
  type: string;
  description: string;
  range: number;
  price: number;
  maxNumber: number;
  color: string;
  minCartValue: number;
}
