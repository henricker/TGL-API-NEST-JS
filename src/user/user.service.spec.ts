import { User } from '.prisma/client';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  fakeNewUser,
  fakeUserEntity,
} from '../../test/mock/fakes/fake-test-user-util';
import { PrismaService } from '../prisma.service';
import { CreateUserInputDTO } from './dto/create-user-input.dto';
import { UpdateUserInputDTO } from './dto/update-user-input.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('create', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be create a new user', async () => {
      const data: CreateUserInputDTO = fakeNewUser;
      const user: User = fakeUserEntity;
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);
      jest.spyOn(prismaService.user as any, 'findUnique').mockReturnValue(null);
      const userCreated = await userService.create(data);
      expect(userCreated).toMatchObject(user);
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when user doesnt create a user', async () => {
      const data: CreateUserInputDTO = fakeNewUser;
      jest.spyOn(prismaService.user as any, 'create').mockResolvedValue(null);
      jest.spyOn(prismaService.user as any, 'findUnique').mockReturnValue(null);
      expect(userService.create(data)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when user doesnt create because email already exists', async () => {
      const data: CreateUserInputDTO = fakeNewUser;
      const user: User = fakeUserEntity;
      jest.spyOn(prismaService.user as any, 'findUnique').mockReturnValue(user);
      expect(userService.create(data)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findBy', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('must return a user when you have passed the id', async () => {
      const user: User = fakeUserEntity;
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([user]);

      const userReturned = await userService.findBy('id', 1);
      expect(userReturned).toMatchObject(user);
      expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when user not found', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([]);
      expect(userService.findBy('id', 1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be update user when has passed id', async () => {
      const dataUpdated: UpdateUserInputDTO = {
        email: 'otherEmail@testing.com',
        name: 'testing new name',
      };
      const user: User = fakeUserEntity;
      jest.spyOn(userService, 'findBy').mockResolvedValue(user);
      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue({ ...user, ...dataUpdated });

      const userUpdated = await userService.update(1, dataUpdated);
      expect(userUpdated).toMatchObject({ ...user, ...dataUpdated });
      expect(userService.findBy).toHaveBeenCalledTimes(1);
      expect(prismaService.user.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be return true when user has deleted with successfully!', async () => {
      const user: User = fakeUserEntity;
      jest.spyOn(userService, 'findBy').mockResolvedValue(user);
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(user);

      const deleted = await userService.delete(1);
      expect(deleted).toBeTruthy();
    });

    it('should be return false when user has not deleted', async () => {
      const user: User = fakeUserEntity;
      jest.spyOn(userService, 'findBy').mockResolvedValue(user);
      jest.spyOn(prismaService.user as any, 'delete').mockResolvedValue(null);

      const deleted = await userService.delete(1);
      expect(deleted).toBeFalsy();
    });
  });
});
