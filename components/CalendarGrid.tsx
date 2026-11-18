'use client'

import { useState } from 'react'
import Link from 'next/link'
import { featuredImage } from '@/lib/api'
import type { WpPost } from '@/lib/types'

export default function CalendarGrid({
  posts,
  type,
}: {
  posts: WpPost[]
  type: 'calendar' | 'calendario'
}) {
  const today = new Date().getDate()
  const persist = type === 'calendario'
  const storageKey = `openDoors-${type}`
  const [openDoors, setOpenDoors] = useState<number[]>(() =>
    persist ? JSON.parse(localStorage.getItem(storageKey) ?? '[]') : [],
  )

  const openDoor = (day: number) => {
    setOpenDoors((doors) => {
      const next = [...doors, day]
      if (persist) localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="calendar-grid">
      {posts.map((post, i) => {
        const day = i + 1
        const canOpen = day <= today
        const isOpen = openDoors.includes(day)
        const img = featuredImage(post)
        return (
          <article key={post.id} className="calendar-door">
            {isOpen ? (
              <Link href={`/${type}/${post.slug}`}>
                {img && <img src={img} alt="" loading="lazy" />}
              </Link>
            ) : (
              <button
                className="door-cover"
                disabled={!canOpen}
                onClick={() => openDoor(day)}
              >
                {img && <img src={img} alt="" loading="lazy" />}
                <div
                  className={
                    canOpen ? 'overlay show-overlay' : 'overlay locked'
                  }
                >
                  <span className="day-number">{day}</span>
                </div>
              </button>
            )}
          </article>
        )
      })}
    </div>
  )
}
