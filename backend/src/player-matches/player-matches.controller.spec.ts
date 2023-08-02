import { Test, TestingModule } from '@nestjs/testing';
import { PlayerMatchesController } from './player-matches.controller';

describe('PlayerMatchesController', () => {
  let controller: PlayerMatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerMatchesController],
    }).compile();

    controller = module.get<PlayerMatchesController>(PlayerMatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
