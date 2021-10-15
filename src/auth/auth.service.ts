import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthInputDTO } from './dto/auth-input.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthType } from './auth.type';
import { HashPasswordTransform } from 'src/shared/helpers/HashPasswordTransformter';
import { User } from '.prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(data: AuthInputDTO): Promise<AuthType> {
    const user = await this.userService.findByUniqueKey('email', data.email, {
      role: true,
    });

    const validPassword = HashPasswordTransform.compare(
      user.password,
      data.password,
    );

    if (!validPassword) throw new UnauthorizedException('invalid credentials');

    const userSchema = { ...user, role: { ...user['role'] } };
    const token = await this.jwtToken(user);

    return {
      user: userSchema,
      token,
    };
  }

  private async jwtToken(user: User): Promise<string> {
    const payload = { id: user.id };
    return this.jwtService.signAsync(payload);
  }
}
