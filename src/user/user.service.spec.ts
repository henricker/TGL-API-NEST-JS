import { User } from '.prisma/client';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  fakeNewUser,
  fakeUserEntity,
} from '../../test/mock/fakes/fake-test-user';
import { PrismaService } from '../prisma.service';
import { CreateUserInputDTO } from './dto/create-user-input.dto';
import { UserService } from './user.service';

describe('service', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    service = moduleRef.get<UserService>(UserService);
  });

  describe('create', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be create a new user', async () => {
      const data: CreateUserInputDTO = fakeNewUser;
      const user: User = fakeUserEntity;
      jest.spyOn(prisma.user, 'create').mockResolvedValue(user);
      jest.spyOn(prisma.user as any, 'findUnique').mockReturnValue(null);
      const userCreated = await service.create(data);
      expect(userCreated).toMatchObject(user);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when user doesnt create a user', async () => {
      const data: CreateUserInputDTO = fakeNewUser;
      jest.spyOn(prisma.user as any, 'create').mockResolvedValue(null);
      jest.spyOn(prisma.user as any, 'findUnique').mockReturnValue(null);
      expect(service.create(data)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when user doesnt create because email already exists', async () => {
      const data: CreateUserInputDTO = fakeNewUser;
      const user: User = fakeUserEntity;
      jest.spyOn(prisma.user as any, 'findUnique').mockReturnValue(user);
      expect(service.create(data)).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
