import PostTypeArchive from '@/components/PostTypeArchive'

export default async function FlagsArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  return <PostTypeArchive type="flags" page={Math.max(1, Number(page) || 1)} />
}
