import type { Metadata } from 'next'
import { getPostsByType, getSite } from '@/lib/api'
import PuzzleList from '@/components/PuzzleListClient'

export const metadata: Metadata = { title: 'Puzzles' }

export default async function PuzzleArchivePage() {
  const [{ posts }, site] = await Promise.all([
    getPostsByType('puzzle', 1, 100),
    getSite(),
  ])
  const cover = site.covers.calendar

  return (
    <div className="page archive-puzzle">
      {cover?.image && (
        <div className="archive-cover">
          <img src={cover.image} alt="" />
          {cover.title && <p className="cover-title">{cover.title}</p>}
        </div>
      )}
      {posts.length === 0 && <p className="status">Keine Puzzles gefunden.</p>}
      <PuzzleList posts={posts} />
    </div>
  )
}
