'use client'

import { useRef, useEffect } from 'react'
import REHero from '@/components/REHero'

export default function Home() {
  const scrollRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main style={{ background: '#0a0a0a' }}>
      {/* 500vh — le scroll déclenche le zoom RE puis la traversée en profondeur */}
      <section style={{ position: 'relative', height: '500vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <REHero scrollRef={scrollRef} />

          {/* Indicateur scroll */}
          <p style={{
            position: 'absolute',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#0a0a0a',
            opacity: 0.32,
            fontWeight: 300,
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            scroll
          </p>
        </div>
      </section>
    </main>
  )
}
