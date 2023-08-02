'use client';

import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { FlexBox } from '../../components/FlexBox/FlexBox';
import { CreatePlayerDto } from '@nexscore/common';
import { useRouter  } from 'next/navigation';
import { PlayersApi } from '../../api/players.api';

export default function AddPlayer() {
  const { push } = useRouter();

  // Handles the submit event on form submit.
  const handleSubmit = async (event: any) => {
    event.preventDefault();
  
    const playerName = event.currentTarget[0].value;

    if (!playerName) {
      alert('Ungültiger Spielername');
      return;
    }

    const createPlayerDto: CreatePlayerDto = {
      name: playerName,
    };

    PlayersApi.createPlayer(createPlayerDto)
      .then(() => push('/'))
      .catch((e) => alert(e));
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FlexBox>
          <h1>Spieler hinzufügen</h1>
          <Input placeholder='Spielername' required></Input>
          <Button type='submit'>Absenden</Button>
        </FlexBox>
      </form>
    </>
  );
}