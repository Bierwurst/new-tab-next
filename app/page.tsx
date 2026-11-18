import { getSite } from '@/lib/api'

export default async function HomePage() {
  const site = await getSite()
  return (
    <div className="status">
      <h1>{site.site_name}</h1>
      <p>Layout-Test: Header, Footer und Site-Daten kommen serverseitig aus der WP-API.</p>
    </div>
  )
}
