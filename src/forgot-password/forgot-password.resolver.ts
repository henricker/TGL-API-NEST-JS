import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ForgotPasswordService } from './forgot-password.service';

@Resolver()
export class ForgotPasswordResolver {
  constructor(private forgotPasswordService: ForgotPasswordService) {}
  @Mutation(() => String)
  public async forgotPassword(@Args('email') email: string): Promise<string> {
    const response = await this.forgotPasswordService.generateRememberMeToken(
      email,
    );
    return response;
  }

  @Mutation(() => String)
  public async refreshPassword(
    @Args('token') token: string,
    @Args('password') password: string,
  ): Promise<string> {
    const response = await this.forgotPasswordService.refreshPassword(
      token,
      password,
    );

    return response;
  }
}
