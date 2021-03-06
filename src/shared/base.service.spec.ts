import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import BaseService from './base.service';

describe('BaseService', () => {
  BaseService.prototype['prisma'] = new PrismaService();
  BaseService.prototype['typeName'] = 'entity';
  BaseService.prototype['prisma']['entity'] = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };
  describe('find', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should return an array with entities', async () => {
      const entitiesMocked = [{ name: 'Joe Doe' }, { name: 'Brior Ruffiny' }];
      BaseService.prototype['prisma']['entity']['findMany'].mockResolvedValue(
        entitiesMocked,
      );
      const entities = await BaseService.prototype.find();
      expect(entities).toMatchObject(entitiesMocked);
      expect(
        BaseService.prototype['prisma']['entity'].findMany,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByUniqueKey', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should return an entity', async () => {
      const entityMocked = { name: 'joe Doe', id: 1 };
      BaseService.prototype['prisma']['entity']['findUnique'].mockResolvedValue(
        entityMocked,
      );
      const entity = await BaseService.prototype.findByUniqueKey('id', 1);
      expect(entity).toMatchObject(entityMocked);
      expect(
        BaseService.prototype['prisma']['entity'].findUnique,
      ).toBeCalledTimes(1);
    });

    it('should return an exception when entity not found', async () => {
      BaseService.prototype['prisma']['entity']['findUnique'].mockResolvedValue(
        null,
      );
      expect(
        BaseService.prototype.findByUniqueKey('id', 1),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('shoud be return true when an entity has been deleted', async () => {
      const entityMocked = { name: 'joe Doe', id: 1 };
      BaseService.prototype['prisma']['entity']['findUnique'].mockResolvedValue(
        entityMocked,
      );
      BaseService.prototype['prisma']['entity']['delete'].mockResolvedValue(
        entityMocked,
      );

      const deleted = await BaseService.prototype.delete(1);
      expect(deleted).toBeTruthy();
      expect(
        BaseService.prototype['prisma']['entity'].findUnique,
      ).toHaveBeenCalledTimes(1);
      expect(
        BaseService.prototype['prisma']['entity'].delete,
      ).toHaveBeenCalledTimes(1);
    });

    it('should be return false when an entity not been deleted', async () => {
      const entityMocked = { name: 'joe Doe', id: 1 };
      BaseService.prototype['prisma']['entity']['findUnique'].mockResolvedValue(
        entityMocked,
      );
      BaseService.prototype['prisma']['entity']['delete'].mockResolvedValue(
        null,
      );

      const deleted = await BaseService.prototype.delete(1);
      expect(deleted).toBeFalsy();
      expect(
        BaseService.prototype['prisma']['entity'].findUnique,
      ).toHaveBeenCalledTimes(1);
      expect(
        BaseService.prototype['prisma']['entity'].delete,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be update user when has passed id', async () => {
      const dataUpdated = {
        name: 'joe twincks',
      };
      const entity = {
        id: 1,
        name: 'joe twincks',
      };
      jest
        .spyOn(BaseService.prototype, 'findByUniqueKey')
        .mockResolvedValue(entity);

      BaseService.prototype['prisma']['entity'].update.mockResolvedValue({
        ...entity,
        ...dataUpdated,
      });

      const entityUpdated = await BaseService.prototype.update(1, dataUpdated);
      expect(entityUpdated).toMatchObject({ ...entity, ...dataUpdated });
      expect(BaseService.prototype.findByUniqueKey).toHaveBeenCalledTimes(1);
      expect(
        BaseService.prototype['prisma']['entity'].update,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should be create a new entity', async () => {
      const entityData = { name: 'Joe Doe' };
      const entityMocked = { id: 1, ...entityData };

      BaseService.prototype['prisma']['entity'].create.mockResolvedValue(
        entityMocked,
      );

      const entity = await BaseService.prototype.create(entityData);
      expect(entity).toMatchObject(entityMocked);
      expect(
        BaseService.prototype['prisma']['entity'].create,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
