import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PlayerMatchesEntity } from './player-matches.entity';
import { MatchEntity } from '../matches/match.entity';
import { PlayerEntity } from '../players/player.entity';

@Injectable()
export class PlayerMatchesService {
  constructor(
    @Inject('PLAYER_MATCHES_REPOSITORY')
    private readonly playerMatchesRepostory: Repository<PlayerMatchesEntity>,
  ) {}

  async createIfNotExist(
    matchId: string,
    playerId: string,
  ): Promise<PlayerMatchesEntity> {
    const existingPlayerMatch = await this.playerMatchesRepostory.findOne({
      where: {
        matchId,
        playerId,
      },
    });

    if (existingPlayerMatch) {
      return existingPlayerMatch;
    }

    return this.create(matchId, playerId);
  }

  async create(
    matchId: string,
    playerId: string,
  ): Promise<PlayerMatchesEntity> {
    return this.playerMatchesRepostory.save({ matchId, playerId });
  }

  async addPlayerMatches(
    matchIds: MatchEntity['matchId'][],
    playerId: PlayerEntity['id'],
  ) {
    return this.playerMatchesRepostory.save(
      matchIds.map((matchId) => ({ matchId, playerId })),
    );
  }

  async getPlayerMatchesCount(playerId: PlayerEntity['id']) {
    return this.playerMatchesRepostory.count({ where: { playerId } });
  }
}
