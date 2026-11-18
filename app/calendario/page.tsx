import type { Metadata } from 'next'
import CalendarArchive from '@/components/CalendarArchive'

export const metadata: Metadata = { title: 'Calendario' }

export default function CalendarioArchivePage() {
  return <CalendarArchive type="calendario" />
}
