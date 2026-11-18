import type { Metadata } from 'next'
import PostTypeSingle from '@/components/PostTypeSingle'
import { decodeEntities, getPostBySlug } from '@/lib/api'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const post = await getPostBySlug('posts', (await params).slug)
  return { title: post ? decodeEntities(post.title.rendered) : undefined }
}

export default async function PostSinglePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ p?: string }>
}) {
  const { slug } = await params
  const { p } = await searchParams
  return <PostTypeSingle type="posts" slug={slug} fromPage={Number(p) || 1} />
}
