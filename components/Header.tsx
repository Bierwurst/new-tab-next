'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toLocalPath } from '@/lib/api'
import type { SiteData } from '@/lib/types'

export default function Header({ site }: { site: SiteData }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <Link href="/" className="site-logo">
        {site.logo_url ? (
          <img src={site.logo_url} alt={site.site_name} />
        ) : (
          site.site_name
        )}
      </Link>
      <button
        className="menu-toggle"
        aria-label="Menü"
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
      <nav className={open ? 'main-menu open' : 'main-menu'}>
        <ul>
          {site.menus.primary
            .filter(
              (item) =>
                item.parent === 0 &&
                (item.url === '#' || toLocalPath(item.url) !== '/'),
            )
            .map((item) => {
              const children = site.menus.primary.filter(
                (c) => c.parent === item.id,
              )
              return (
                <li key={item.id} className={children.length ? 'has-children' : ''}>
                  {item.url === '#' ? (
                    <span>{item.title}</span>
                  ) : (
                    <Link href={toLocalPath(item.url)} onClick={() => setOpen(false)}>
                      {item.title}
                    </Link>
                  )}
                  {children.length > 0 && (
                    <ul className="submenu">
                      {children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={toLocalPath(child.url)}
                            onClick={() => setOpen(false)}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
        </ul>
      </nav>
    </header>
  )
}
