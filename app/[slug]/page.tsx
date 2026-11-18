import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/api'

export default async function GenericPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()

  return (
    <div
      className="page content-card"
      dangerouslySetInnerHTML={{ __html: page.content.rendered }}
    />
  )
}
