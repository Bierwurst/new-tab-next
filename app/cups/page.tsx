import PostTypeArchive from '@/components/PostTypeArchive'

export default async function CupsArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  return <PostTypeArchive type="cups" page={Math.max(1, Number(page) || 1)} />
}
