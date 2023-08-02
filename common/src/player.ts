export type PlayerDto = {
  id: string;
  name: string;
  puuid: string;
  profileIconId: number;
};

export type CreatePlayerDto = Omit<PlayerDto, 'id' | 'puuid' | 'profileIconId'>;
