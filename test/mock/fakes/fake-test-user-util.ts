import { User } from '.prisma/client';
import { CreateUserInputDTO } from 'src/user/dto/create-user-input.dto';

export const fakeNewUser: CreateUserInputDTO = {
  email: 'testing@email.com',
  name: 'testing',
  password: '@Password123',
};

export const fakeUserEntity: User = {
  id: 1,
  name: 'testing',
  email: 'testing@email.com',
  lastBet: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  password: '@Password123',
  rememberMeToken: null,
  rememberMeTokenCreatedAt: null,
  roleId: 2,
};
