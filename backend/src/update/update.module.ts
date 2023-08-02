import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { matchProviders } from '../matches/matches.providers';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '../database/database.module';
import { PlayersModule } from '../players/players.module';
import { PlayerMatchesModule } from '../player-matches/player-matches.module';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    MatchesModule,
    PlayersModule,
    PlayerMatchesModule,
  ],
  providers: [UpdateService, ...matchProviders],
})
export class UpdateModule {}
