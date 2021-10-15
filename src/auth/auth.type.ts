import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

@ObjectType()
export class AuthType {
  @Field(() => User)
  user: User;

  @Field(() => String)
  token: string;
}
