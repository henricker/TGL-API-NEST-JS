import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { AdminService } from './admin.service';

@Resolver()
export class AdminResolver {
  constructor(private adminService: AdminService) {}

  @Mutation(() => User)
  public async promote(@Args('id') id: number): Promise<User> {
    const user = await this.adminService.promote(id);
    return { ...user, role: { ...user['role'] } };
  }

  @Mutation(() => User)
  public async demote(@Args('id') id: number): Promise<User> {
    const user = await this.adminService.demote(id);
    return { ...user, role: { ...user['role'] } };
  }
}
