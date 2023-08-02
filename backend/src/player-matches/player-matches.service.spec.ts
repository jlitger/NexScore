import { Test, TestingModule } from '@nestjs/testing';
import { PlayerMatchesService } from './player-matches.service';

describe('PlayerMatchesService', () => {
  let service: PlayerMatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerMatchesService],
    }).compile();

    service = module.get<PlayerMatchesService>(PlayerMatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
