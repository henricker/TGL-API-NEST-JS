import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

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
}
