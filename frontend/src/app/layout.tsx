import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import styles from './styles.module.scss';
import { FlexBox } from '../components/FlexBox/FlexBox';
import Link from 'next/link';
import classNames from 'classnames';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NexScore',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={classNames(inter.className, styles.body)}>
        <header>
          <FlexBox direction='row' justify='start'>
            <h1 className={styles.logo}><Link href='/' className={styles.link}>NexScore</Link></h1>
            <ul className={styles.navList}>
              <li><Link href='add-player' className={styles.link}>Add Player</Link></li>
            </ul>
          </FlexBox>
          <hr />
        </header>
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  )
}
