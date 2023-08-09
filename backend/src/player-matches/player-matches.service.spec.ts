import { Test, TestingModule } from '@nestjs/testing';
import { PlayerMatchesService } from './player-matches.service';
import { mockPlayerMatchesProviders } from './player-matches.providers';

describe('PlayerMatchesService', () => {
  let service: PlayerMatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerMatchesService, ...mockPlayerMatchesProviders],
    }).compile();

    service = module.get<PlayerMatchesService>(PlayerMatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
