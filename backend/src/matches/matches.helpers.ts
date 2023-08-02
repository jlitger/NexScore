import { Regions } from '@nexscore/common';

export class MatchesHelper {
  static buildMatchUrl(matchId: string, region: Regions) {
    return `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
  }
}
