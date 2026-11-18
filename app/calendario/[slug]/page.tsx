import CalendarSingle from '@/components/CalendarSingle'

export default async function CalendarioSinglePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <CalendarSingle type="calendario" slug={slug} />
}
