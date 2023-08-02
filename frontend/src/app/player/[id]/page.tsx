import { PlayerDto, PlayerStatsDto } from '@nexscore/common';

async function getPlayerData(playerName: string): Promise<PlayerStatsDto> {
  const response = await fetch(`http://nexscore-backend:3000/players/by-name/${playerName}`,{ next: { revalidate: 1 } });
  // Recommendation: handle errors
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  const player: PlayerDto = await response.json();

  const statsResponse = await fetch(`http://nexscore-backend:3000/stats/${player.id}`);
  
  if (!statsResponse.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return statsResponse.json();
}

export default async function PlayerProfile({ params }: { params: { id: string } }) {
  const data = await getPlayerData(params.id);

  return <div>{data.player.name}: {data.totalScore}</div>;
}