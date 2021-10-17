import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { BussinessRulesUser } from 'src/user/validator/bussiness-user.rule';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordResolver } from './forgot-password.resolver';

@Module({
  providers: [
    ForgotPasswordService,
    UserService,
    PrismaService,
    BussinessRulesUser,
    ForgotPasswordResolver,
  ],
})
export class ForgotPasswordModule {}
