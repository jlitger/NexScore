import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { MatchesModule } from '../matches/matches.module';
import { PlayersModule } from '../players/players.module';
import { HttpModule } from '@nestjs/axios';
import { PlayerMatchesModule } from '../player-matches/player-matches.module';

@Module({
  imports: [MatchesModule, PlayersModule, HttpModule, PlayerMatchesModule],
  controllers: [StatsController],
})
export class StatsModule {}
