import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { BussinessRulesUser } from './validator/bussiness-user.rule';

@Module({
  providers: [UserService, PrismaService, UserResolver, BussinessRulesUser],
  exports: [UserService],
})
export class UserModule {}
