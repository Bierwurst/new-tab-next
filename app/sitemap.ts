import type { MetadataRoute } from 'next'
import { getPostsByType } from '@/lib/api'
import type { WpPost } from '@/lib/types'

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:3000'

const TYPES = ['caps', 'flags', 'cups', 'puzzle', 'calendar', 'calendario', 'posts']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/caps',
    '/flags',
    '/cups',
    '/calendar',
    '/calendario',
    '/puzzle',
  ].map((path) => ({ url: `${SITE_URL}${path}` }))

  const lists = await Promise.all(
    TYPES.map((type) => getPostsByType(type, 1, 100).catch(() => ({ posts: [] as WpPost[] }))),
  )
  const postRoutes = lists.flatMap(({ posts }, i) =>
    posts.map((post) => ({
      url: `${SITE_URL}/${TYPES[i] === 'posts' ? 'post' : TYPES[i]}/${post.slug}`,
      lastModified: post.date,
    })),
  )

  return [...staticRoutes, ...postRoutes]
}
