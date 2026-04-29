import { Link } from '@inertiajs/react'
import type { PropsWithChildren } from 'react'

/**
 * レイアウトコンポーネント
 * @param param0 
 * @returns 
 */
export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="app">
      <header>
        <nav>
          <Link href="/">Home</Link>
          {' | '}
          <Link href="/users">Users</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
