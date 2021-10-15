import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthType } from './auth.type';
import { AuthInputDTO } from './dto/auth-input.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthType)
  public async authenticate(
    @Args('data') data: AuthInputDTO,
  ): Promise<AuthType> {
    const response = await this.authService.validateUser(data);
    return response;
  }
}
