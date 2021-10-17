import { User } from '.prisma/client';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import BaseService from '../shared/base.service';
import { PrismaService } from '../prisma.service';
import { CreateUserInputDTO } from './dto/create-user-input.dto';
import { BussinessRulesUser } from './validator/bussiness-user.rule';
import { HashPasswordTransform } from 'src/shared/helpers/HashPasswordTransformter';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class UserService extends BaseService<User> {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'user-consumer',
        allowAutoTopicCreation: true,
      },
    },
  })
  private clientKafka: ClientKafka;

  constructor(
    prisma: PrismaService,
    private bussinessRules: BussinessRulesUser,
  ) {
    super(prisma);
  }

  public async create(data: CreateUserInputDTO, load?: any): Promise<User> {
    await this.bussinessRules.validateCreate({ email: data.email });

    data.password = HashPasswordTransform.hash(data.password);
    const user = await this.prisma.user.create({ data, include: load });

    if (!user)
      throw new InternalServerErrorException('error: cannot create user');

    this.clientKafka.emit('mailer-event', {
      contact: {
        name: user.name,
        email: user.email,
      },
      template: 'welcome-user',
    });

    return user;
  }

  public async update(
    id: number,
    data: Partial<User>,
    load?: any,
  ): Promise<User> {
    await this.bussinessRules.validateOnUpdate(id, data);

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      include: load,
    });

    return userUpdated;
  }
}
