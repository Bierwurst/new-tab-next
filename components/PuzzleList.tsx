'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { WpPost } from '@/lib/types'

const TILE_AMOUNTS = [16, 36, 64, 144]

export default function PuzzleList({ posts }: { posts: WpPost[] }) {
  const [tiles, setTiles] = useState(() =>
    Number(localStorage.getItem('tilesAmount')) || 16,
  )

  useEffect(() => {
    localStorage.setItem('tilesAmount', String(tiles))
  }, [tiles])

  return (
    <>
      <label htmlFor="puzzletiles">Wähle Anzahl Kacheln: </label>
      <select
        id="puzzletiles"
        value={tiles}
        onChange={(e) => setTiles(Number(e.target.value))}
      >
        {TILE_AMOUNTS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <div className="puzzle-grid">
        {posts.map((post, i) => (
          <article key={post.id} className="puzzle-tile">
            <Link href={`/puzzle/${post.slug}`}>{i + 1}</Link>
          </article>
        ))}
      </div>
    </>
  )
}
