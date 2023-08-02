import { DataSource } from 'typeorm';
import { PlayerEntity } from './player.entity';

export const playerProviders = [
  {
    provide: 'PLAYER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PlayerEntity),
    inject: ['DATA_SOURCE'],
  },
];
