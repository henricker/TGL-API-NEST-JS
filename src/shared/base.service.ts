import { NotFoundException } from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma.service';

export default abstract class BaseService<T> {
  protected prisma: PrismaService;
  protected typeName: string;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
    this.typeName = this.constructor.name.replace('Service', '').toLowerCase();
  }

  public async create(data: Partial<T>, load?: any): Promise<T> {
    const entity = await this.prisma[this.typeName].create({
      data,
      include: load,
    });
    return entity;
  }

  public async update(id: number, data: Partial<T>, load?: any): Promise<T> {
    const entity = await this.findByUniqueKey('id', id);
    const entityUpdated = await this.prisma[this.typeName].update({
      where: { id },
      data: { ...entity, ...data, updatedAt: new Date() },
      include: load,
    });

    return entityUpdated;
  }

  public async findByUniqueKey(
    fieldName: string,
    value: any,
    load?: any,
  ): Promise<T> {
    const where = {};
    where[fieldName] = value;
    try {
      const entity = await this.prisma[this.typeName].findUnique({
        where,
        include: load,
      });

      if (!entity)
        throw new NotFoundException(`error: ${this.typeName} not found`);

      return entity;
    } catch (err) {
      if (err instanceof PrismaClientValidationError) {
        throw new NotFoundException(`error: ${this.typeName} not found`);
      }
      throw err;
    }
  }

  public async find(options?: findOptions): Promise<T[]> {
    const entities = await this.prisma[this.typeName].findMany(options);
    return entities;
  }

  public async delete(id: number): Promise<boolean> {
    const entity = await this.findByUniqueKey('id', id);
    const where = {};
    where['id'] = entity['id'];
    const deleted = !!(await this.prisma[this.typeName].delete({ where }));
    return deleted;
  }
}

type findOptions = {
  include?: any;
  select?: any;
  where?: any;
};
