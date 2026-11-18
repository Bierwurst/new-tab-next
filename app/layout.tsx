import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSite } from '@/lib/api'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'New Tab',
  description: 'New Tab',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = await getSite()
  return (
    <html lang="de">
      <body>
        <Header site={site} />
        <main>{children}</main>
        <Footer site={site} />
      </body>
    </html>
  )
}
