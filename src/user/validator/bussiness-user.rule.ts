import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UpdateUserInputDTO } from '../dto/update-user-input.dto';

type validateCreate = {
  email: string;
};

@Injectable()
export class BussinessRulesUser {
  constructor(private prisma: PrismaService) {}

  public async validateCreate({ email }: validateCreate): Promise<void> {
    const emailExists = !!(await this.prisma.user.findUnique({
      where: { email: email },
    }));

    if (emailExists) throw new ConflictException('error: email already exists');
  }

  public async validateOnUpdate(
    id: number,
    { email }: UpdateUserInputDTO,
  ): Promise<void> {
    const userExists = !!(await this.prisma.user.findUnique({ where: { id } }));

    if (!userExists) throw new NotFoundException('user not found');

    if (email) {
      const emailExists = !!(await this.prisma.user.findUnique({
        where: { email },
      }));

      if (emailExists) throw new ConflictException('email already exists');
    }
  }
}
