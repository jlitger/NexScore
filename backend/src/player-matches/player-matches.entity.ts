import { Column, Entity } from 'typeorm';

@Entity({ name: 'player_matches' })
export class PlayerMatchesEntity {
  @Column({ primary: true })
  matchId: string;

  @Column({ primary: true })
  playerId: string;
}
