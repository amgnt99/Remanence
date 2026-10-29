'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)

  useEffect(() => {
    let x = -100, y = -100
    let cx = -100, cy = -100
    let rafId = null

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
    }

    const tick = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${cx}px, ${cy}px)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#ffffff',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-100px, -100px)',
        marginLeft: '-5px',
        marginTop: '-5px',
        mixBlendMode: 'difference',
      }}
    />
  )
}
