import { Inject, Injectable, Logger } from '@nestjs/common';
import { MatchEntity } from './match.entity';
import { Repository } from 'typeorm';
import { PlayerEntity } from '../players/player.entity';

@Injectable()
export class MatchesService {
  private readonly logger: Logger = new Logger(MatchesService.name);
  constructor(
    @Inject('MATCH_REPOSITORY')
    private matchRepository: Repository<MatchEntity>,
  ) {}

  async addMatches(matchIds: MatchEntity['matchId'][]) {
    return this.matchRepository.save(matchIds.map((id) => ({ matchId: id })));
  }

  async create(ent: MatchEntity) {
    this.logger.debug(`Creating match ${ent.matchId} without score`);
    return await this.matchRepository.insert(ent);
  }

  async createIfNotExist(ent: MatchEntity) {
    this.logger.debug(`Load match ${ent.matchId} if it does not yet exist`);

    if (await this.findOneByMatchId(ent.matchId)) {
      this.logger.debug(`Not loading match ${ent.matchId}; it already exists`);
      return;
    }

    return await this.create(ent);
  }

  async findOneByMatchId(matchId: string) {
    return this.matchRepository.findOneBy({ matchId });
  }

  async findAll() {
    return await this.matchRepository.find({
      where: { updated: true },
    });
  }

  async findHighScore(): Promise<{ score_id: string; count: number }> {
    const score = await this.matchRepository
      .createQueryBuilder('sc')
      .select(['sc.winnerId as score_id', 'COUNT(sc.matchId)'])
      .groupBy('sc.winnerId')
      .where(`sc.winnerId <> ''`)
      .orderBy('count', 'DESC')
      .getRawOne();

    return score;
  }

  async findMatchToUpdate() {
    return await this.matchRepository.findOne({
      where: { updated: false },
      order: { matchId: 'ASC' },
    });
  }

  async update(matchId: string, player: PlayerEntity) {
    return await this.matchRepository.update(matchId, {
      winner: player,
      updated: true,
    });
  }

  async getPlayerScoresByPuuid(puuid: string) {
    return await this.matchRepository.countBy({ winner: { puuid } });
  }
}
