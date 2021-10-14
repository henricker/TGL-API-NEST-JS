import { Test, TestingModule } from '@nestjs/testing';
import { BetResolver } from './bet.resolver';

describe('BetResolver', () => {
  let resolver: BetResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetResolver],
    }).compile();

    resolver = module.get<BetResolver>(BetResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
