import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PlayerHelpers } from '../players/players.helpers';
import { Regions, Servers } from '@nexscore/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PlayersService } from '../players/players.service';
import { MatchesService } from '../matches/matches.service';
import { MatchesHelper } from '../matches/matches.helpers';
import { PlayerMatchesService } from '../player-matches/player-matches.service';

@Injectable()
export class UpdateService {
  private readonly logger = new Logger(UpdateService.name);

  constructor(
    private matchesService: MatchesService,
    private playersService: PlayersService,
    private playerMatchesService: PlayerMatchesService,
    private httpService: HttpService,
  ) {}

  @Cron('*/5 * * * * *')
  async updatePlayer() {
    this.logger.debug('Attempting to update all players');

    const player = await this.playersService.findPlayerToUpdate();

    if (!player) {
      this.logger.debug('No player requiring update found');
      return;
    }

    this.logger.debug(`Updating player ${player.name}`);

    let response: AxiosResponse;
    let start = 0;

    do {
      const url = PlayerHelpers.buildMatchesUrl(
        player.puuid,
        Regions.EUROPE,
        start,
        100,
      );

      response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY,
          },
        }),
      );

      this.matchesService.addMatches(response.data);
      this.playerMatchesService.addPlayerMatches(response.data, player.id);

      start += 100;
    } while (response.data && response.data.length > 0);

    if (!player.profileIconId) {
      const response = await firstValueFrom(
        this.httpService.get(
          PlayerHelpers.buildPlayerByPuuidUrl(player.puuid, Servers.EUW),
          {
            headers: {
              'X-Riot-Token': process.env.RIOT_API_KEY,
            },
          },
        ),
      );

      this.playersService.updatePlayerProfileIconId(
        player.id,
        response.data.profileIconId,
      );
    }

    this.playersService.updateLastPlayerUpdateTime(player.id);
  }

  @Cron('*/5 * * * * *')
  async updateMatches() {
    this.logger.debug('Attempting to update a match');

    const matchToUpdate = await this.matchesService.findMatchToUpdate();

    if (!matchToUpdate) {
      this.logger.debug('No more matches to update!');
      return;
    }

    this.logger.debug(`Update match ${matchToUpdate.matchId}`);

    const url = MatchesHelper.buildMatchUrl(
      matchToUpdate.matchId,
      Regions.EUROPE,
    );

    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      }),
    );

    const nexusKillers = response.data.info.participants.filter(
      (p) => p.nexusKills > 0,
    );

    if (!nexusKillers || nexusKillers.length != 1) {
      return await this.matchesService.update(matchToUpdate.matchId, null);
    }

    let player = await this.playersService.findOneByPuuid(
      nexusKillers[0].puuid,
    );

    if (!player) {
      player = await this.playersService.createPlayerByPuuid(
        nexusKillers[0].puuid,
        false,
      );
    }

    return await this.matchesService.update(matchToUpdate.matchId, player);
  }
}
