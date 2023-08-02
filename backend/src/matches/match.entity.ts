import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { PlayerEntity } from '../players/player.entity';

@Entity('matches')
export class MatchEntity {
  @PrimaryColumn()
  matchId: string;

  @ManyToOne(() => PlayerEntity, (player) => player.wins, {
    nullable: true,
    eager: true,
  })
  winner: PlayerEntity | null;

  @Column({ default: false })
  updated: boolean;
}
