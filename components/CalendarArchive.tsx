import { getPostsByType, getSite } from '@/lib/api'
import CalendarGrid from './CalendarGridClient'

export default async function CalendarArchive({
  type,
}: {
  type: 'calendar' | 'calendario'
}) {
  const [{ posts }, site] = await Promise.all([
    type === 'calendario'
      ? Promise.all([
          getPostsByType('posts', 1, 100),
          getPostsByType('calendario', 1, 100),
        ]).then(([a, b]) => ({
          posts: [...a.posts, ...b.posts].sort((x, y) =>
            y.date.localeCompare(x.date),
          ),
        }))
      : getPostsByType('calendar', 1, 100),
    getSite(),
  ])

  const cover = site.covers[type]
  const coverTitle = cover?.title || site.covers.calendar?.title || ''

  return (
    <div className={`page archive-calendar archive-${type}`}>
      {cover?.image && (
        <div className="archive-cover">
          <img src={cover.image} alt="" />
          {coverTitle && <p className="cover-title">{coverTitle}</p>}
        </div>
      )}
      {posts.length === 0 && <p className="status">Keine Beiträge gefunden.</p>}
      <CalendarGrid posts={posts} type={type} />
    </div>
  )
}
