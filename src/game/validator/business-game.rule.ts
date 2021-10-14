import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

type validateCreate = {
  type: string;
};

@Injectable()
export default class BusinessRulesGame {
  constructor(private prisma: PrismaService) {}

  public async validateCreate({ type }: validateCreate): Promise<void> {
    const gameExists = !!(await this.prisma.game.findUnique({
      where: { type },
    }));

    if (gameExists)
      throw new ConflictException('error: game type already exists');
  }
}
