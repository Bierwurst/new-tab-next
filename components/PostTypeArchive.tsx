import Link from 'next/link'
import { decodeEntities, featuredImage, getPostsByType, getSite } from '@/lib/api'
import { ARCHIVES } from '@/lib/archiveConfig'

export default async function PostTypeArchive({
  type,
  page,
}: {
  type: string
  page: number
}) {
  const config = ARCHIVES[type]
  const [{ posts, totalPages }, site] = await Promise.all([
    getPostsByType(type, page, config.perPage),
    getSite(),
  ])
  const cover = site.covers[type]

  return (
    <div className="page">
      {cover?.image && (
        <div className="archive-cover">
          <img src={cover.image} alt="" />
          {cover.title && <p className="cover-title">{cover.title}</p>}
        </div>
      )}
      <h1>{config.title}</h1>
      {posts.length === 0 && <p className="status">{config.emptyText}</p>}
      <ul className="cap-grid">
        {posts.map((post) => {
          const img = featuredImage(post)
          return (
            <li key={post.id} className="cap-card">
              <Link href={`/${type}/${post.slug}?p=${page}`}>
                {img && <img src={img} alt="" loading="lazy" />}
                <h2>{decodeEntities(post.title.rendered)}</h2>
              </Link>
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <nav className="pagination">
          {page > 1 && (
            <Link href={`/${type}?page=${page - 1}`}>&lt; Zurück</Link>
          )}
          <span>
            Seite {page} von {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/${type}?page=${page + 1}`}>Weiter &gt;</Link>
          )}
        </nav>
      )}
    </div>
  )
}
