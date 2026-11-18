import { getPage, getSite } from '@/lib/api'

/** Extracts the largest URL of the first <img> and the HTML without it. */
function extractHero(html: string): { url: string | null; rest: string } {
  const figureMatch = html.match(/<figure[^>]*>[\s\S]*?<\/figure>/)
  const imgMatch = html.match(/<img[^>]*>/)
  const target = figureMatch && imgMatch && figureMatch.index === imgMatch.index
    ? figureMatch[0]
    : imgMatch?.[0]
  if (!target) return { url: null, rest: html }

  const srcset = target.match(/srcset="([^"]*)"/)?.[1]
  const url = srcset
    ? (srcset.split(',').pop()?.trim().split(' ')[0] ?? null)
    : (target.match(/src="([^"]*)"/)?.[1] ?? null)
  return { url, rest: html.replace(target, '') }
}

export default async function HomePage() {
  const site = await getSite()
  const page = await getPage(site.front_page_id)
  const { url, rest } = extractHero(page.content.rendered)

  return (
    <div className="frontpage-main-content">
      {url && (
        <div
          className="hero"
          style={{ backgroundImage: `url(${url})` }}
          role="img"
          aria-label={site.site_name}
        />
      )}
      <div
        className="page home-content"
        dangerouslySetInnerHTML={{ __html: rest }}
      />
    </div>
  )
}
