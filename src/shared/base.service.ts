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

  public abstract create(data: Partial<T>): Promise<T>;

  public async update(id: number, data: Partial<T>): Promise<T> {
    const entity = await this.findByUniqueKey('id', id);
    const entityUpdated = await this.prisma[this.typeName].update({
      where: { id },
      data: { ...entity, ...data, updatedAt: new Date() },
    });

    return entityUpdated;
  }

  public async findByUniqueKey(fieldName: string, value: any): Promise<T> {
    const where = {};
    where[fieldName] = value;

    try {
      const entity = await this.prisma[this.typeName].findUnique({
        where,
      });

      if (!entity)
        throw new NotFoundException(`error: ${this.typeName} not found`);

      return entity;
    } catch (err) {
      if (err instanceof PrismaClientValidationError)
        throw new NotFoundException(`error: ${this.typeName} not found`);
      throw err;
    }
  }

  public async find(): Promise<T[]> {
    const entities = await this.prisma[this.typeName].findMany();
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
