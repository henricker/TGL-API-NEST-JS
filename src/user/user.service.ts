import { User } from '.prisma/client';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import BaseService from '../shared/base.service';
import { PrismaService } from '../prisma.service';
import { CreateUserInputDTO } from './dto/create-user-input.dto';
import { UpdateUserInputDTO } from './dto/update-user-input.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  public async create(data: CreateUserInputDTO): Promise<User> {
    const emailExists = !!(await this.prisma.user.findUnique({
      where: { email: data.email },
    }));

    if (emailExists) throw new ConflictException('error: email already exists');

    const user = await this.prisma.user.create({ data });

    if (!user)
      throw new InternalServerErrorException('error: cannot create user');

    return user;
  }

  public async update(id: number, data: UpdateUserInputDTO): Promise<User> {
    const user = await this.findByUniqueKey('id', id);

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: { ...user, ...data, updatedAt: new Date() },
    });

    return userUpdated;
  }
}
