import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  HttpCode,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PlayersService } from './players.service';
import { PlayerMapper } from './player.mapper';
import { CreatePlayerDto, PlayerDto, PlayerStatsDto } from '@nexscore/common';
import { MatchesService } from '../matches/matches.service';
import { PlayerMatchesService } from '../player-matches/player-matches.service';

@Controller('players')
export class PlayersController {
  private readonly logger = new Logger(PlayersController.name);

  constructor(
    private readonly playersService: PlayersService,
    private readonly matchesService: MatchesService,
    private readonly playerMatchesService: PlayerMatchesService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  async findAll(): Promise<PlayerDto[]> {
    return this.playersService
      .findAll()
      .then((players) => players.map(PlayerMapper.toDto));
  }

  @Get('/:playerId')
  async find(@Param('playerId') playerId: PlayerDto['id']): Promise<PlayerDto> {
    return this.playersService.findOneById(playerId).then(PlayerMapper.toDto);
  }

  @Get('/by-name/:playerId')
  async findByName(
    @Param('playerId') playerName: PlayerDto['name'],
  ): Promise<PlayerDto> {
    const player = await this.playersService.findOneByName(playerName);

    if (!player) {
      throw new NotFoundException();
    }

    return PlayerMapper.toDto(player);
  }

  @Post()
  async create(@Body() createDto: CreatePlayerDto): Promise<PlayerDto> {
    const newPlayer = await this.playersService.createPlayer(
      createDto.name,
      true,
    );

    return PlayerMapper.toDto(newPlayer);
  }

  @HttpCode(202)
  @Post('/:playerId/update')
  async requestUpdate(@Param('playerId') playerId: string) {
    this.logger.debug(`Received update request for player ${playerId}`);

    const player = await this.playersService.findOneById(playerId);

    if (!player) {
      this.logger.debug(`Unable to find player by id ${playerId}`);
      throw new NotFoundException();
    }

    await this.playersService.resetUpdatedTime(player.id);
  }

  @Get('/:playerId/stats')
  async getPlayerStats(
    @Param('playerId') playerId: string,
  ): Promise<PlayerStatsDto> {
    const player = await this.playersService.findOneById(playerId);

    if (!player) {
      throw new NotFoundException();
    }

    const wins = await this.matchesService.getPlayerScoresByPuuid(player.puuid);
    const totalMatches = await this.playerMatchesService.getPlayerMatchesCount(
      player.id,
    );

    return {
      player,
      totalScore: wins,
      trackedMatches: totalMatches,
      nexScore: (wins / totalMatches) * 100,
    };
  }
}
