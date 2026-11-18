'use client'

import dynamic from 'next/dynamic'

const CalendarGrid = dynamic(() => import('./CalendarGrid'), { ssr: false })

export default CalendarGrid
