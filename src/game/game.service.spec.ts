import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  fakeGameEntity,
  fakeNewGame,
} from '../../test/mock/fakes/fake-test-game';
import { PrismaService } from '../prisma.service';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService, PrismaService],
    }).compile();

    service = module.get<GameService>(GameService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be create a new game', async () => {
      const newGameData = fakeNewGame;
      const gameMocked = fakeGameEntity;
      jest.spyOn(prisma.game as any, 'findUnique').mockReturnValue(null);
      jest.spyOn(prisma.game, 'create').mockResolvedValue(gameMocked);
      const game = await service.create(newGameData);

      expect(game).toMatchObject(gameMocked);
      expect(prisma.game.create).toHaveBeenCalledTimes(1);
    });

    it('should be return exception when already exists one game with the same type', async () => {
      const newGameData = fakeNewGame;
      const gameMocked = fakeGameEntity;
      jest.spyOn(prisma.game, 'findUnique').mockResolvedValue(gameMocked);
      jest.spyOn(prisma.game, 'create').mockResolvedValue(gameMocked);
      expect(service.create(newGameData)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });
});
