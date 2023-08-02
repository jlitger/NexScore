import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PlayersModule } from '../src/players/players.module';
import { Test } from '@nestjs/testing';
import { PlayersService } from '../src/players/players.service';

describe('Players', () => {
  const existingPlayers = [{ id: '0', name: 'name' }];
  let app: INestApplication;
  const playersService = { findAll: () => existingPlayers };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PlayersModule],
    })
      .overrideProvider(PlayersService)
      .useValue(playersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('GET /players', () => {
    return supertest(app.getHttpServer())
      .get('/players')
      .expect(200)
      .expect(existingPlayers);
  });

  afterAll(async () => {
    await app.close();
  });
});
