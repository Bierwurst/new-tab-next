'use client'

import dynamic from 'next/dynamic'

const PuzzleList = dynamic(() => import('./PuzzleList'), { ssr: false })

export default PuzzleList
