import Image from 'next/image'
import styles from './page.module.css'
import { GlobalStatsDto, PlayerStatsDto } from '@nexscore/common';
import { Column, Table } from '@/components/Table/Table';
import { FlexBox } from '@/components/FlexBox/FlexBox';
import variables from '@/app/exported_styles.module.scss';

async function getData(): Promise<GlobalStatsDto> {
  const response = await fetch('http://nexscore-backend:3000/stats',{ next: { revalidate: 1 } })
  // Recommendation: handle errors
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return response.json();
}

async function getLeaderData(): Promise<PlayerStatsDto[]> {
  const response = await fetch('http://nexscore-backend:3000/stats/leaders',{ next: { revalidate: 1 } });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

const columns: Column<PlayerStatsDto>[] = [
  {
    name: '',
    getColumnValue: (val) => (
      <Image width={32} height={32} src={`http://ddragon.leagueoflegends.com/cdn/13.14.1/img/profileicon/${val.player.profileIconId}.png`} alt={'icon'}      />
    ),
  },
  {
    name: 'Name',
    getColumnValue: (val) => val.player.name,
  },
  {
    name: 'Total NexScores',
    getColumnValue: (val) => val.totalScore,
  },
  {
    name: 'Matches',
    getColumnValue: (val) => val.trackedMatches,
  },
  {
    name: 'NexScore',
    getColumnValue: (val) => val.nexScore,
  }
];

export default async function Home() {
  const data = await getData();
  const leaders = await getLeaderData();

  return (
    <FlexBox direction='column' justify='start' gap={variables.paddingLarge}>
      <section>
        <Table columns={columns} values={leaders}></Table>
      </section>
      <section>
        <p>Tracked games: {data.totalMatches}</p>
        <p>Games without NexScore: {data.matchesWithNoScore}</p>
        <p>Highscore: {data.highestScore.player.name}, {data.highestScore.totalScore}</p>
      </section>
    </FlexBox>
  )
}