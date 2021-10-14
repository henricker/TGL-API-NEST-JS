import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserInputDTO } from './dto/create-user-input.dto';
import { UpdateUserInputDTO } from './dto/update-user-input.dto';

@Resolver('User')
export class UserResolver {
  constructor(private service: UserService) {}

  @Mutation(() => User)
  public async createUser(
    @Args('data') data: CreateUserInputDTO,
  ): Promise<User> {
    const user = await this.service.create(data, { role: true });
    console.log(user);
    return { ...user, role: user['role'] };
  }

  @Query(() => [User])
  public async users(): Promise<User[]> {
    const user = await this.service.find({ include: { role: true } });
    const usersSchema = user.map((user) => ({
      ...user,
      role: { ...user['role'] },
    }));

    return usersSchema;
  }

  @Query(() => User)
  public async user(@Args('id') id: number): Promise<User> {
    const user = await this.service.findByUniqueKey('id', id, { role: true });
    return { ...user, role: { ...user['role'] } };
  }

  @Mutation(() => User)
  public async updateUser(
    @Args('id') id: number,
    @Args('data') data: UpdateUserInputDTO,
  ): Promise<User> {
    const userUpdated = await this.service.update(id, data, { role: true });
    return { ...userUpdated, role: { ...userUpdated['role'] } };
  }

  @Mutation(() => Boolean)
  public async deleteUser(@Args('id') id: number): Promise<boolean> {
    const deleted = await this.service.delete(id);
    return deleted;
  }
}
