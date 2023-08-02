import Image from 'next/image'
import styles from './page.module.css'
import { Button } from '@/components/Button/Button'
import { PlayerStatsDto } from '@nexscore/common'

async function getLeaderboardData(): Promise<PlayerStatsDto[]> {
  const response = await fetch('http://nexscore-backend:3000/stats/leaders',{ next: { revalidate: 1 } });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function Leaderboard() {
  const leaders = await getLeaderboardData();

  return (
    <main>
      <div>
        <p> Leaderboard! </p>
        <ul className={styles.test}>
        {leaders.map((p) => (
            <li key={p.player.name}>
              <span>{p.player.name}: <b>{p.totalScore}</b>, {p.trackedMatches}, {p.nexScore.toFixed(2)}%</span>
            </li>
          ))}
        </ul>
        <Button>Inhalt des buttons</Button>
      </div>
    </main>
  )
}
