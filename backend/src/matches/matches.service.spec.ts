import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';

describe('MatchesService', () => {
  let service: MatchesService;
  const mockMatches = [];
  const mockMatchRepository = {
    save: (matches: any[]) => mockMatches.push(matches),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchesService,
        { provide: 'MATCH_REPOSITORY', useValue: mockMatchRepository },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('should add matches', async () => {
    await service.addMatches(['id1']);

    expect(mockMatches.length).toEqual(0);
  });
});
