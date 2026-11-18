import type { Metadata } from 'next'
import CalendarArchive from '@/components/CalendarArchive'

export const metadata: Metadata = { title: 'Kalender' }

export default function CalendarArchivePage() {
  return <CalendarArchive type="calendar" />
}
