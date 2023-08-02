import { DataSource } from 'typeorm';
import { PlayerMatchesEntity } from './player-matches.entity';

export const playerMatchesProviders = [
  {
    provide: 'PLAYER_MATCHES_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PlayerMatchesEntity),
    inject: ['DATA_SOURCE'],
  },
];
