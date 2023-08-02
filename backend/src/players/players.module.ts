import { Module, forwardRef } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { playerProviders } from './players.providers';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';
import { MatchesModule } from '../matches/matches.module';
import { PlayerMatchesModule } from '../player-matches/player-matches.module';
import { matchProviders } from '../matches/matches.providers';
import { playerMatchesProviders } from '../player-matches/player-matches.providers';

@Module({
  imports: [
    PlayerMatchesModule,
    DatabaseModule,
    HttpModule,
    forwardRef(() => MatchesModule),
  ],
  controllers: [PlayersController],
  providers: [
    PlayersService,
    ...playerProviders,
    ...matchProviders,
    ...playerMatchesProviders,
  ],
  exports: [PlayersService],
})
export class PlayersModule {}
