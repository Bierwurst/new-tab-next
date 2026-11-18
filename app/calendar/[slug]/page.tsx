import CalendarSingle from '@/components/CalendarSingle'

export default async function CalendarSinglePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <CalendarSingle type="calendar" slug={slug} />
}
