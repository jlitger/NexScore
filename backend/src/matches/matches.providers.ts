import { DataSource } from 'typeorm';
import { MatchEntity } from './match.entity';

export const matchProviders = [
  {
    provide: 'MATCH_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MatchEntity),
    inject: ['DATA_SOURCE'],
  },
];
