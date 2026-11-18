import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/api'
import type { WpPost } from '@/lib/types'

export default async function CalendarSingle({
  type,
  slug,
}: {
  type: 'calendar' | 'calendario'
  slug: string
}) {
  const types = type === 'calendario' ? ['calendario', 'posts'] : [type]
  let post: WpPost | null = null
  for (const t of types) {
    post = await getPostBySlug(t, slug)
    if (post) break
  }
  if (!post) notFound()

  return (
    <div className="page content-card frontpage-main-content single-calendar">
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      <div className="back-to-archive">
        <Link href={`/${type}`}>Zurück zur Übersicht</Link>
      </div>
    </div>
  )
}
