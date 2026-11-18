import Link from 'next/link'
import { notFound } from 'next/navigation'
import { featuredImage, getPostBySlug } from '@/lib/api'
import PuzzleStage from '@/components/PuzzleStageClient'

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
