import { Module } from '@nestjs/common';
import { PlayerMatchesController } from './player-matches.controller';
import { PlayerMatchesService } from './player-matches.service';
import { playerMatchesProviders } from './player-matches.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PlayerMatchesController],
  providers: [PlayerMatchesService, ...playerMatchesProviders],
  exports: [PlayerMatchesService],
})
export class PlayerMatchesModule {}
