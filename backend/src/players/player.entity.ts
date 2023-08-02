import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MatchEntity } from '../matches/match.entity';

@Entity('players')
export class PlayerEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  puuid: string;

  @Column()
  name: string;

  @Column('integer', { nullable: true })
  profileIconId: number;

  @Column('date', { nullable: true })
  lastUpdate: Date | null;

  @Column({ default: false })
  isTracked: boolean;

  @OneToMany(() => MatchEntity, (match) => match.winner)
  wins: MatchEntity[];
}
