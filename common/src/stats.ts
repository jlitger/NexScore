import { PlayerDto } from './player';

export type PlayerStatsDto = {
  player: PlayerDto;
  totalScore: number;
  trackedMatches: number;
  nexScore: number;
}

export type GlobalStatsDto = {
  totalMatches: number;
  matchesWithNoScore: number;
  matchesWithScore: number;
  highestScore: PlayerStatsDto;
}