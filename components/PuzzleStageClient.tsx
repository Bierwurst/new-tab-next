'use client'

import dynamic from 'next/dynamic'

const PuzzleStage = dynamic(() => import('./PuzzleStage'), { ssr: false })

export default PuzzleStage
