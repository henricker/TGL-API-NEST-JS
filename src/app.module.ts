import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { BetModule } from './bet/bet.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';

@Module({
  imports: [
    UserModule,
    GameModule,
    BetModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    AdminModule,
    ForgotPasswordModule,
  ],
})
export class AppModule {}
