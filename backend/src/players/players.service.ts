import { Injectable, Inject, Logger, ConflictException } from '@nestjs/common';
import { PlayerEntity } from './player.entity';
import { ILike, IsNull, LessThan, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { PlayerStatsDto, Servers } from '@nexscore/common';
import { MatchEntity } from '../matches/match.entity';
import { PlayerMatchesEntity } from '../player-matches/player-matches.entity';
import { firstValueFrom } from 'rxjs';
import { PlayerHelpers } from './players.helpers';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @Inject('PLAYER_REPOSITORY')
    private playerRepository: Repository<PlayerEntity>,
    @Inject('MATCH_REPOSITORY')
    private matchRepository: Repository<MatchEntity>,
    @Inject('PLAYER_MATCHES_REPOSITORY')
    private playerMatchesRepository: Repository<PlayerMatchesEntity>,
    private httpService: HttpService,
  ) {}

  findAll(): Promise<PlayerEntity[]> {
    return this.playerRepository.find();
  }

  findOneById(playerId: string) {
    if (!playerId) {
      return null;
    }

    return this.playerRepository.findOneBy({ id: playerId });
  }

  findOneByName(playerName: string) {
    if (!playerName) {
      return null;
    }

    return this.playerRepository.findOneBy({ name: ILike(playerName) });
  }

  findOneByPuuid(puuid: string): Promise<PlayerEntity> {
    if (!puuid) {
      return null;
    }

    return this.playerRepository.findOneBy({ puuid });
  }

  async insert(ent: Partial<PlayerEntity>): Promise<PlayerEntity> {
    const newEnt = new PlayerEntity();
    Object.assign(newEnt, ent);
    newEnt.id = `${(await this.findAll()).length}`;

    return this.playerRepository.save(newEnt);
  }

  async findPlayerToUpdate() {
    const date = new Date();

    date.setDate(date.getDate() - 1);

    return this.playerRepository.findOne({
      where: [
        {
          lastUpdate: LessThan(date),
          isTracked: true,
        },
        {
          lastUpdate: IsNull(),
          isTracked: true,
        },
      ],
    });
  }

  async resetUpdatedTime(id: PlayerEntity['id']) {
    this.logger.debug(`Resetting last updated time of player ${id}`);

    return this.playerRepository.update(id, { lastUpdate: null });
  }

  async updateLastPlayerUpdateTime(id: PlayerEntity['id']) {
    this.logger.debug(`Updating last update time of player ${id}`);

    const lastUpdate = new Date();

    return this.playerRepository.update(id, { lastUpdate });
  }

  async updatePlayerProfileIconId(
    id: PlayerEntity['id'],
    profileIconId: string,
  ) {
    this.logger.debug(
      `Updating profile icon id of player ${id}: ${profileIconId}`,
    );

    return this.playerRepository.update(id, {
      profileIconId: Number.parseInt(profileIconId),
    });
  }

  async getLeaders(): Promise<PlayerStatsDto[]> {
    const scoresQuery = (qb) =>
      qb
        .select('COUNT(m.matchId) as wins')
        .from(MatchEntity, 'm')
        .addSelect('m.winnerId as playerId')
        .where("m.winnerId IS NOT NULL AND m.winnerId <> ''")
        .addGroupBy('m.winnerId');

    const matchesQuery = (qb) =>
      qb
        .select('m.playerId')
        .from(PlayerMatchesEntity, 'm')
        .addSelect('COUNT(m.matchId) as matches')
        .addGroupBy('m.playerId');

    const combinedQuery = this.playerRepository
      .createQueryBuilder('p')
      .select('name')
      .addSelect('p.profileIconId')
      .addSelect('wins')
      .addSelect('matches')
      .leftJoin((qb) => scoresQuery(qb), 's', 's.playerId = p.id')
      .leftJoin((qb) => matchesQuery(qb), 'm', 'm."m_playerId" = p.id')
      .where('p.isTracked = true')
      .limit(10);

    const result = await combinedQuery.execute();

    console.log(result);
    const playerStats: PlayerStatsDto[] = result.map(
      (test: {
        name: string;
        p_profileIconId: number;
        wins: number;
        matches: number;
      }) =>
        ({
          player: { name: test.name, profileIconId: test.p_profileIconId },
          totalScore: test.wins,
          nexScore: Math.round(
            ((test.wins ?? 0) / (test.matches ?? 1)) * 10000,
          ),
          trackedMatches: test.matches,
        } as PlayerStatsDto),
    );

    return playerStats.sort((a, b) => b.totalScore - a.totalScore);
  }

  async createPlayer(
    playerName: string,
    tracked = false,
  ): Promise<PlayerEntity> {
    this.logger.debug(`Creating player ${playerName}`);

    const response = await firstValueFrom(
      this.httpService.get(
        PlayerHelpers.buildPlayerUrl(playerName, Servers.EUW),
        {
          headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY,
          },
        },
      ),
    );

    const existingPlayer = await this.findOneByPuuid(response.data.puuid);

    if (existingPlayer && existingPlayer.isTracked) {
      this.logger.debug(`Player ${playerName} already exists`);
      throw new ConflictException();
    }

    if (existingPlayer && !existingPlayer.isTracked) {
      return this.trackExistingPlayer(existingPlayer);
    }

    const createEntity = new PlayerEntity();
    createEntity.name = response.data.name;
    createEntity.puuid = response.data.puuid;
    createEntity.profileIconId = response.data.profileIconId;
    createEntity.isTracked = tracked;
    createEntity.lastUpdate = null;

    return this.insert(createEntity);
  }

  async trackExistingPlayer(player: PlayerEntity) {
    player.isTracked = true;
    return this.playerRepository.save(player);
  }

  async createPlayerByPuuid(
    puuid: string,
    tracked = false,
  ): Promise<PlayerEntity> {
    this.logger.debug(`Creating player by puuid ${puuid}`);

    const response = await firstValueFrom(
      this.httpService.get(
        PlayerHelpers.buildPlayerByPuuidUrl(puuid, Servers.EUW),
        {
          headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY,
          },
        },
      ),
    );

    const existingPlayer = await this.findOneByPuuid(response.data.puuid);

    if (existingPlayer) {
      this.logger.debug(`Player ${puuid} already exists`);
      throw new ConflictException();
    }

    const createEntity = new PlayerEntity();
    createEntity.name = response.data.name;
    createEntity.puuid = response.data.puuid;
    createEntity.isTracked = tracked;
    createEntity.lastUpdate = null;

    return this.insert(createEntity);
  }
}
