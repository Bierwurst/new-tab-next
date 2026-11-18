import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  decodeEntities,
  featuredImage,
  getCategoryBySlug,
  getPostsByCategory,
} from '@/lib/api'

export default async function CategoryArchivePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()
  const { posts } = await getPostsByCategory(category.id)

  return (
    <div className="page">
      <h1>{decodeEntities(category.name)}</h1>
      {posts.length === 0 && (
        <p className="status">Keine Beiträge in dieser Kategorie.</p>
      )}
      <ul className="cap-grid">
        {posts.map((post) => {
          const img = featuredImage(post)
          return (
            <li key={post.id} className="cap-card">
              <Link href={`/post/${post.slug}`}>
                {img && <img src={img} alt="" loading="lazy" />}
                <h2>{decodeEntities(post.title.rendered)}</h2>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
