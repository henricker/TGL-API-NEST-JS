import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { BussinessRulesUser } from 'src/user/validator/bussiness-user.rule';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';

@Module({
  providers: [
    AdminService,
    BussinessRulesUser,
    UserService,
    PrismaService,
    AdminResolver,
  ],
})
export class AdminModule {}
