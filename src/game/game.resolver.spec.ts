import { Test, TestingModule } from '@nestjs/testing';
import {
  fakeGameEntity,
  fakeNewGame,
} from '.././../test/mock/fakes/fake-test-game';
import { PrismaService } from '../prisma.service';
import { GameResolver } from './game.resolver';
import { GameService } from './game.service';

describe('GameResolver', () => {
  let resolver: GameResolver;
  let prisma: PrismaService;
  let service: GameService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameResolver, GameService, PrismaService],
    }).compile();

    resolver = module.get<GameResolver>(GameResolver);
    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('game', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be return ganme and invoke service and prisma', async () => {
      const gameMocked = fakeGameEntity;
      jest.spyOn(prisma.game, 'findUnique').mockResolvedValue(gameMocked);
      jest.spyOn(service, 'findByUniqueKey');
      const game = await resolver.game(1);

      expect(game).toMatchObject(gameMocked);
      expect(service.findByUniqueKey).toBeCalledTimes(1);
      expect(prisma.game.findUnique).toBeCalledTimes(1);
    });
  });

  describe('games', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be return an array with games and invoe service and prisma', async () => {
      const gamesMocked = [fakeGameEntity, fakeGameEntity, fakeGameEntity];
      jest.spyOn(prisma.game, 'findMany').mockResolvedValue(gamesMocked);
      jest.spyOn(service, 'find');
      const games = await resolver.games();

      expect(games == gamesMocked).toBe(true);
      expect(service.find).toBeCalledTimes(1);
      expect(prisma.game.findMany).toBeCalledTimes(1);
    });
  });

  describe('createGame', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be create game and return game', async () => {
      const gameDataMocked = fakeNewGame;
      const gameMocked = fakeGameEntity;
      jest.spyOn(prisma.game, 'create').mockResolvedValue(gameMocked);
      jest.spyOn(service, 'create');

      const game = await service.create(gameDataMocked);
      expect(game).toMatchObject(gameMocked);
      expect(prisma.game.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledTimes(1);
    });
  });

  describe('updateGame', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be update game and return game updated', async () => {
      const gameDataMocked = { ...fakeNewGame, type: 'lotomania' };
      const gameMocked = fakeGameEntity;
      jest
        .spyOn(prisma.game, 'update')
        .mockResolvedValue({ ...gameMocked, ...gameDataMocked });

      jest.spyOn(service, 'update');

      const gameUpdated = await resolver.updateGame(1, gameDataMocked);
      expect(gameUpdated).toMatchObject({ ...gameMocked, ...gameDataMocked });
      expect(prisma.game.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledTimes(1);
    });
  });

  describe('deleteGame', () => {
    it('should be delete game and return true', async () => {
      const gameMocked = fakeGameEntity;

      jest.spyOn(service, 'findByUniqueKey').mockResolvedValue(gameMocked);
      jest.spyOn(prisma.game, 'delete').mockResolvedValue(gameMocked);
      jest.spyOn(service, 'delete');

      const deleted = await resolver.deleteGame(1);
      expect(deleted).toBeTruthy();
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(prisma.game.delete).toHaveBeenCalledTimes(1);
    });
  });
});
