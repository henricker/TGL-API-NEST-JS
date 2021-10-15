import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { BussinessRulesUser } from 'src/user/validator/bussiness-user.rule';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_KEY,
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    BussinessRulesUser,
    AuthResolver,
    JwtStrategy,
  ],
})
export class AuthModule {}
