import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(private userService: UserService) {}

  public async promote(id: number): Promise<User> {
    const userToPromote = await this.userService.update(
      id,
      { roleId: 1 },
      { role: true },
    );
    return userToPromote;
  }

  public async demote(id: number): Promise<User> {
    const userToDemote = await this.userService.update(
      id,
      { roleId: 2 },
      { role: true },
    );
    return userToDemote;
  }
}
