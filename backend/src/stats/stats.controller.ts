import { Controller, Get, NotFoundException } from '@nestjs/common';
import { MatchesService } from '../matches/matches.service';
import { GlobalStatsDto, PlayerStatsDto, Servers } from '@nexscore/common';
import { PlayersService } from '../players/players.service';
import { HttpService } from '@nestjs/axios';
import { PlayerHelpers } from '../players/players.helpers';
import { firstValueFrom } from 'rxjs';
import { PlayerMatchesService } from '../player-matches/player-matches.service';

@Controller('stats')
export class StatsController {
  constructor(
    private readonly scoresService: MatchesService,
    private readonly playerMatchesService: PlayerMatchesService,
    private readonly httpService: HttpService,
    private readonly playersService: PlayersService,
  ) {}

  @Get()
  async getGlobalStats(): Promise<GlobalStatsDto> {
    const matches = await this.scoresService.findAll();
    const highScore = await this.scoresService.findHighScore();

    if (!highScore) {
      return {
        totalMatches: 0,
        highestScore: {
          nexScore: 0,
          player: {
            id: '0',
            name: 'no player',
            profileIconId: 0,
            puuid: '0',
          },
          totalScore: 0,
          trackedMatches: 0,
        },
        matchesWithNoScore: 0,
        matchesWithScore: 0,
      };
    }

    let player = await this.playersService.findOneById(highScore.score_id);

    if (!player) {
      const response = await firstValueFrom(
        this.httpService.get(
          PlayerHelpers.buildPlayerByPuuidUrl(highScore.score_id, Servers.EUW),
          {
            headers: {
              'X-Riot-Token': process.env.RIOT_API_KEY,
            },
          },
        ),
      );

      const createEntity = {
        puuid: response.data.puuid,
        name: response.data.name,
      };

      player = await this.playersService.insert(createEntity);
    }

    const trackedMatches =
      await this.playerMatchesService.getPlayerMatchesCount(player.id);

    return Promise.resolve({
      totalMatches: matches.length,
      matchesWithNoScore: matches.filter((m) => m.winner === null).length,
      matchesWithScore: matches.filter((m) => m.winner !== null).length,
      highestScore: {
        player,
        totalScore: highScore.count,
        trackedMatches: trackedMatches,
        nexScore: Math.round((highScore.count / trackedMatches) * 10000),
      },
    });
  }

  @Get('/leaders')
  async getLeaders(): Promise<PlayerStatsDto[]> {
    const leaders = await this.playersService.getLeaders();

    if (!leaders) {
      throw new NotFoundException();
    }

    return leaders;
  }
}
