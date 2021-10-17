import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as crypto from 'crypto';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import * as moment from 'moment';
import { HashPasswordTransform } from 'src/shared/helpers/HashPasswordTransformter';

@Injectable()
export class ForgotPasswordService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'forgot-password-consumer',
        allowAutoTopicCreation: true,
      },
    },
  })
  private clientKafka: ClientKafka;

  constructor(private userService: UserService) {}
  public async generateRememberMeToken(email: string): Promise<string> {
    const rememberMeToken = crypto.randomBytes(12).toString('hex');
    const user = await this.userService.findByUniqueKey('email', email);
    const userUpdated = await this.userService.update(user.id, {
      rememberMeToken,
      rememberMeTokenCreatedAt: new Date(),
    });

    this.clientKafka.emit('mailer-event', {
      contact: {
        name: userUpdated.name,
        email: userUpdated.email,
        remember_me_token: userUpdated.rememberMeToken,
      },
      template: 'forgot-password-user',
    });

    return 'Check your email to refresh your password';
  }

  public async refreshPassword(
    token: string,
    password: string,
  ): Promise<string> {
    const user = await this.userService.findByUniqueKey(
      'rememberMeToken',
      token,
    );

    const tokenExpired = moment()
      .subtract('2', 'days')
      .isAfter(user.rememberMeTokenCreatedAt);

    if (tokenExpired) throw new BadRequestException('token expired');

    const passwordHashed = HashPasswordTransform.hash(password);

    await this.userService.update(user.id, {
      rememberMeToken: null,
      rememberMeTokenCreatedAt: null,
      password: passwordHashed,
    });

    return 'Password updated with successfully!';
  }
}
