import PostTypeSingle from '@/components/PostTypeSingle'

export default async function CupSinglePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ p?: string }>
}) {
  const { slug } = await params
  const { p } = await searchParams
  return <PostTypeSingle type="cups" slug={slug} fromPage={Number(p) || 1} />
}
