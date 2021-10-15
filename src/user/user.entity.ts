import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Role {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;
}

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  name: string;

  email: string;

  @HideField()
  password: string;

  @Field(() => Role)
  role: Role;
}
