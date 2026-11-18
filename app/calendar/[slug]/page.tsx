import type { Metadata } from 'next'
import CalendarSingle from '@/components/CalendarSingle'
import { decodeEntities, getPostBySlug } from '@/lib/api'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const post = await getPostBySlug('calendar', (await params).slug)
  return { title: post ? decodeEntities(post.title.rendered) : undefined }
}

export default async function CalendarSinglePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <CalendarSingle type="calendar" slug={slug} />
}
