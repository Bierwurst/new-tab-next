'use client'

import { useState } from 'react'

export default function PuzzleStage({ img }: { img: string | null }) {
  const [tilesAmount] = useState(
    () => Number(localStorage.getItem('tilesAmount')) || 16,
  )
  const [removed, setRemoved] = useState<number[]>([])
  const remaining = tilesAmount - removed.length

  return (
    <>
      <div className="puzzle-stage">
        {img && <img className="single-image" src={img} alt="" />}
        <div
          className="puzzleOuter"
          style={{ gridTemplateColumns: `repeat(${Math.sqrt(tilesAmount)}, 1fr)` }}
        >
          {Array.from({ length: tilesAmount }, (_, i) => (
            <button
              key={i}
              className={
                removed.includes(i)
                  ? 'puzzleButton transparent'
                  : 'puzzleButton'
              }
              onClick={() => setRemoved((r) => [...r, i])}
            >
              ?
            </button>
          ))}
        </div>
      </div>
      <div id="puzzleCounter">{remaining}</div>
    </>
  )
}
