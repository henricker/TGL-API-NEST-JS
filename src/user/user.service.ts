import { User } from '.prisma/client';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import BaseService from '../shared/base.service';
import { PrismaService } from '../prisma.service';
import { CreateUserInputDTO } from './dto/create-user-input.dto';

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
}
