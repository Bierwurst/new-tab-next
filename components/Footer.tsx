'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { toLocalPath } from '@/lib/api'
import type { SiteData } from '@/lib/types'

export default function Footer({ site }: { site: SiteData }) {
  const transparent = usePathname() === '/'
  const f = site.footer
  return (
    <footer
      className={transparent ? 'site-footer on-hero' : 'site-footer'}
    >
      <ul className="contact">
        {f.name_1 && <li>{f.name_1}</li>}
        {f.name_2 && <li>{f.name_2}</li>}
        {f.street && <li>{f.street}</li>}
        {(f.city || f.post_code) && (
          <li>
            {f.city} {f.post_code}
          </li>
        )}
        {f.phone_1 && (
          <li>
            <a href={`tel:${f.phone_1_tel}`}>{f.phone_1}</a>
          </li>
        )}
        {f.phone_2 && (
          <li>
            <a href={`tel:${f.phone_2_tel}`}>{f.phone_2}</a>
          </li>
        )}
        {f.e_mail && (
          <li>
            <a href={`mailto:${f.e_mail}`}>{f.e_mail}</a>
          </li>
        )}
      </ul>
      <nav className="footer-menu">
        <ul>
          {site.menus.footer.map((item) => (
            <li key={item.id}>
              <Link href={toLocalPath(item.url)}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <span className="footer-copyright">
        &copy; {new Date().getFullYear()}{' '}
        <Link href="/">{site.site_name}</Link>
      </span>
    </footer>
  )
}
