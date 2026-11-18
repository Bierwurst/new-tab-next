import Link from 'next/link'
import { notFound } from 'next/navigation'
import { decodeEntities, featuredImage, getPostBySlug } from '@/lib/api'
import { ARCHIVES } from '@/lib/archiveConfig'

export default async function PostTypeSingle({
  type,
  slug,
  fromPage,
}: {
  type: string
  slug: string
  fromPage: number
}) {
  const config = ARCHIVES[type]
  const post = await getPostBySlug(type, slug)
  if (!post) notFound()

  const img = featuredImage(post, 'large')

  return (
    <div className={`page content-card frontpage-main-content ${type}`}>
      <h3>{decodeEntities(post.title.rendered)}</h3>
      {img && <img className="single-image" src={img} alt="" />}
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      <div className="back-to-archive">
        <Link href={`/${type}?page=${fromPage}`}>{config.backText}</Link>
      </div>
    </div>
  )
}
