import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { decodeEntities, getPageBySlug } from '@/lib/api'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const page = await getPageBySlug((await params).slug)
  return { title: page ? decodeEntities(page.title.rendered) : undefined }
}

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
