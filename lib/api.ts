import { decode } from 'he'
import type { SiteData, WpCategory, WpPage, WpPost } from './types'

// Lokal: WP aus new-tab-headless (Docker, :8082); produktiv: https://new-tab.de
const API_BASE = process.env.WP_API_BASE ?? ''

async function apiFetch(path: string): Promise<Response> {
  const res = await fetch(API_BASE + path)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res
}

export async function getSite(): Promise<SiteData> {
  return (await apiFetch('/wp-json/woowoow/v1/site')).json()
}

export interface PostList {
  posts: WpPost[]
  totalPages: number
}

export async function getPostsByType(
  type: string,
  page = 1,
  perPage = 12,
): Promise<PostList> {
  const res = await apiFetch(
    `/wp-json/wp/v2/${type}?per_page=${perPage}&page=${page}&_embed=1`,
  )
  return {
    posts: await res.json(),
    totalPages: Number(res.headers.get('X-WP-TotalPages') ?? '1'),
  }
}

export async function getPostBySlug(
  type: string,
  slug: string,
): Promise<WpPost | null> {
  const res = await apiFetch(
    `/wp-json/wp/v2/${type}?slug=${encodeURIComponent(slug)}&_embed=1`,
  )
  const posts = (await res.json()) as WpPost[]
  return posts[0] ?? null
}

export async function getCategoryBySlug(
  slug: string,
): Promise<WpCategory | null> {
  const res = await apiFetch(
    `/wp-json/wp/v2/categories?slug=${encodeURIComponent(slug)}`,
  )
  const cats = (await res.json()) as WpCategory[]
  return cats[0] ?? null
}

export async function getPostsByCategory(
  categoryId: number,
  page = 1,
): Promise<PostList> {
  const res = await apiFetch(
    `/wp-json/wp/v2/posts?categories=${categoryId}&per_page=12&page=${page}&_embed=1`,
  )
  return {
    posts: await res.json(),
    totalPages: Number(res.headers.get('X-WP-TotalPages') ?? '1'),
  }
}

export async function getPage(id: number): Promise<WpPage> {
  return (await apiFetch(`/wp-json/wp/v2/pages/${id}`)).json()
}

export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  const res = await apiFetch(
    `/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}`,
  )
  const pages = (await res.json()) as WpPage[]
  return pages[0] ?? null
}

/** Converts absolute WP URLs (https://new-tab.de/...) to local paths. */
export function toLocalPath(url: string): string {
  try {
    const parsed = new URL(url, 'https://placeholder.local')
    return parsed.pathname + parsed.search + parsed.hash
  } catch {
    return url
  }
}

export function featuredImage(
  post: WpPost,
  size = 'medium',
): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  return (
    media?.media_details?.sizes?.[size]?.source_url ??
    media?.source_url ??
    null
  )
}

export function decodeEntities(html: string): string {
  return decode(html)
}
