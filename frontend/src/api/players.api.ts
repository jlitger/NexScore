import { CreatePlayerDto } from '@nexscore/common';

async function createPlayer(createPlayerDto: CreatePlayerDto) {
  const response = await fetch('http://localhost:3000/players', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPlayerDto),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Fehler ${error.statusCode}: ${error.message}`);
  }

  return JSON.parse(await response.json());
}

const PlayersApi = {
  createPlayer,
};

export { PlayersApi };