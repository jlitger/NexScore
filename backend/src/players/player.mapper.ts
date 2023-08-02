import { CreatePlayerDto, PlayerDto } from '@nexscore/common';
import { PlayerEntity } from './player.entity';

export class PlayerMapper {
  static toCreateEntity(createDto: CreatePlayerDto): Partial<PlayerEntity> {
    return {
      name: createDto.name,
    };
  }

  static toDto(entity: PlayerEntity): PlayerDto {
    return {
      id: entity.id,
      name: entity.name,
      puuid: entity.puuid,
      profileIconId: entity.profileIconId,
    };
  }
}
