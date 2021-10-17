import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordResolver } from './forgot-password.resolver';

describe('ForgotPasswordResolver', () => {
  let resolver: ForgotPasswordResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForgotPasswordResolver],
    }).compile();

    resolver = module.get<ForgotPasswordResolver>(ForgotPasswordResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
