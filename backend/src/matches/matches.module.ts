import { Module, forwardRef } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { matchProviders } from './matches.providers';
import { DatabaseModule } from '../database/database.module';
import { MatchesController } from './matches.controller';
import { PlayersModule } from '../players/players.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule, forwardRef(() => PlayersModule)],
  providers: [MatchesService, ...matchProviders],
  exports: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
