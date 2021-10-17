import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserInputDTO } from './dto/create-user-input.dto';
import { UpdateUserInputDTO } from './dto/update-user-input.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/CurrentUser.decorator';
import { User as UserPrisma } from '.prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/Roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Resolver('User')
export class UserResolver {
  constructor(private service: UserService) {}

  @Mutation(() => User)
  public async createUser(
    @Args('data') data: CreateUserInputDTO,
  ): Promise<User> {
    const user = await this.service.create(data, { role: true });
    return { ...user, role: user['role'] };
  }

  @Query(() => [User])
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(GqlAuthGuard)
  public async users(): Promise<User[]> {
    const user = await this.service.find({
      include: { role: true },
    });
    const usersSchema = user.map((user) => ({
      ...user,
      role: { ...user['role'] },
    }));

    return usersSchema;
  }

  @Query(() => User)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(GqlAuthGuard)
  public async user(@CurrentUser() userPrisma: UserPrisma): Promise<User> {
    return {
      ...userPrisma,
      role: { ...userPrisma['role'] },
    };
  }

  @Mutation(() => User)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(GqlAuthGuard)
  public async updateUser(
    @CurrentUser() userPrisma: UserPrisma,
    @Args('data') data: UpdateUserInputDTO,
  ): Promise<User> {
    const userUpdated = await this.service.update(userPrisma.id, data, {
      role: true,
    });
    return { ...userUpdated, role: { ...userUpdated['role'] } };
  }

  @Mutation(() => Boolean)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(GqlAuthGuard)
  public async deleteUser(
    @CurrentUser() userPrisma: UserPrisma,
  ): Promise<boolean> {
    const deleted = await this.service.delete(userPrisma.id);
    return deleted;
  }
}
