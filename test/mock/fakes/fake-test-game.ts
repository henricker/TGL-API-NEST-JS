import { Game } from '.prisma/client';
import { CreateGameInputDTO } from '../../../src/game/dto/create-game-input.dto';

export const fakeNewGame: CreateGameInputDTO = {
  type: 'Mega-Sena',
  description:
    'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
  color: '#01AC66',
  maxNumber: 6,
  minCartValue: 30,
  range: 60,
  price: 4.5,
};

export const fakeGameEntity: Game = {
  id: 1,
  type: 'Mega-Sena',
  description:
    'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
  color: '#01AC66',
  maxNumber: 6,
  price: 4.5,
  minCartValue: 30,
  range: 60,
  createdAt: new Date(),
  updatedAt: new Date(),
};
