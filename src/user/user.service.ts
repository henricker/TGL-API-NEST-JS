import { User } from '.prisma/client';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import BaseService from '../shared/base.service';
import { PrismaService } from '../prisma.service';
import { CreateUserInputDTO } from './dto/create-user-input.dto';
import { BussinessRulesUser } from './validator/bussiness-user.rule';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    prisma: PrismaService,
    private bussinessRules: BussinessRulesUser,
  ) {
    super(prisma);
  }

  public async create(data: CreateUserInputDTO, load?: any): Promise<User> {
    await this.bussinessRules.validateCreate({ email: data.email });

    const user = await this.prisma.user.create({ data, include: load });

    if (!user)
      throw new InternalServerErrorException('error: cannot create user');

    return user;
  }
}
