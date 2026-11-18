import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { decodeEntities, featuredImage, getPostBySlug } from '@/lib/api'
import PuzzleStage from '@/components/PuzzleStageClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const post = await getPostBySlug('puzzle', (await params).slug)
  return { title: post ? decodeEntities(post.title.rendered) : undefined }
}

export default async function PuzzleSinglePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug('puzzle', slug)
  if (!post) notFound()

  return (
    <div className="page frontpage-main-content puzzle">
      <PuzzleStage img={featuredImage(post)} />
      <div className="back-to-archive">
        <Link href="/puzzle">Zurück zur Übersicht</Link>
      </div>
    </div>
  )
}
