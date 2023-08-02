import { Regions, Servers } from '@nexscore/common';

export class PlayerHelpers {
  static buildPlayerUrl(playerName: string, server: Servers) {
    return `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${playerName}`;
  }

  static buildPlayerByPuuidUrl(playerPuuid: string, server: Servers) {
    return `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${playerPuuid}`;
  }

  static buildMatchesUrl(
    playerPuuid: string,
    server: Regions,
    startIndex: number,
    count: number,
  ) {
    return `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${playerPuuid}/ids?start=${startIndex}&count=${count}`;
  }
}
