import { Bet, Game, User } from '.prisma/client';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { fakeBetEntity, fakeNewBet } from '../../test/mock/fakes/fake-test-bet';
import { fakeGameEntity } from '../../test/mock/fakes/fake-test-game';
import { fakeUserEntity } from '../../test/mock/fakes/fake-test-user';
import { PrismaService } from '../prisma.service';
import { BetService } from './bet.service';

describe('BetService', () => {
  let service: BetService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetService, PrismaService],
    }).compile();

    service = module.get<BetService>(BetService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be create a new game', async () => {
      const userMocked: User = fakeUserEntity;
      const gameMocked: Game = fakeGameEntity;
      const betMocked: Bet = fakeBetEntity;
      const dataInput = fakeNewBet;

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(userMocked);
      jest.spyOn(prisma.game, 'findUnique').mockResolvedValue(gameMocked);
      jest.spyOn(prisma.bet, 'create').mockResolvedValue(betMocked);

      const bet = await service.create(dataInput);
      expect(bet).toMatchObject(betMocked);
    });

    it('should be return exception when owner of bet not exists', async () => {
      const dataInput = fakeNewBet;
      jest.spyOn(prisma.user as any, 'findUnique').mockResolvedValue(null);
      expect(service.create(dataInput)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should be returne exception when game of bet not exists', async () => {
      const dataInput = fakeNewBet;
      const user = fakeUserEntity;

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(prisma.game as any, 'findUnique').mockResolvedValue(null);

      expect(service.create(dataInput)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
