import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MatchesModule } from './matches/matches.module';
import { StatsModule } from './stats/stats.module';
import { PlayerMatchesModule } from './player-matches/player-matches.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UpdateModule } from './update/update.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PlayersModule,
    DatabaseModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MatchesModule,
    StatsModule,
    PlayerMatchesModule,
    UpdateModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
