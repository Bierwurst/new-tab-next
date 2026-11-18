import type { Metadata } from 'next'
import PostTypeArchive from '@/components/PostTypeArchive'

export const metadata: Metadata = { title: 'Kronkorken' }

export default async function CapsArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  return <PostTypeArchive type="caps" page={Math.max(1, Number(page) || 1)} />
}
