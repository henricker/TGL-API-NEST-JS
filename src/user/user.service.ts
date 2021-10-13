import { User } from '.prisma/client';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserInputDTO } from './dto/create-user-input.dto';
import { UpdateUserInputDTO } from './dto/update-user-input.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  public async findBy(fieldName: string, value: any): Promise<User | User[]> {
    const where = {};
    where[fieldName] = value;
    const users = await this.prisma.user.findMany({
      where: where,
    });

    if (users.length === 0)
      throw new NotFoundException('error: user not found');

    return users.length === 1 ? users[0] : users;
  }

  public async update(id: number, data: UpdateUserInputDTO): Promise<User> {
    const user = await this.findBy('id', id);

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: { ...user, ...data },
    });

    return userUpdated;
  }

  public async delete(id: number): Promise<boolean> {
    const user = await this.findBy('id', id);
    const where = {};
    where['id'] = user['id'];
    const deleted = !!(await this.prisma.user.delete({ where }));

    return deleted;
  }

  public async find(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }
}
