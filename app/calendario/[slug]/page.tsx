import type { Metadata } from 'next'
import CalendarSingle from '@/components/CalendarSingle'
import { decodeEntities, getPostBySlug } from '@/lib/api'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post =
    (await getPostBySlug('calendario', slug)) ??
    (await getPostBySlug('posts', slug))
  return { title: post ? decodeEntities(post.title.rendered) : undefined }
}

export default async function CalendarioSinglePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <CalendarSingle type="calendario" slug={slug} />
}
