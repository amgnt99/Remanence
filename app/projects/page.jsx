'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'

const DARK  = '#0a0a0a'
const CREAM = '#f5f4f0'
const GAP   = 12 // px entre les cartes

const PROJECTS = [
  { slug: 'labsence-disponible',  title: "L'absence disponible",  video: '/videos/projects/labsence-disponible.mp4'  },
  { slug: 'lattention-captive',   title: "L'attention captive",   video: '/videos/projects/lattention-captive.mp4'   },
  { slug: 'lautre-sous-la-peau',  title: "L'autre sous la peau",  video: '/videos/projects/lautre-sous-la-peau.mp4'  },
  { slug: 'la-distance-dissoute', title: 'La distance dissoute',  video: '/videos/projects/la-distance-dissoute.mp4' },
  { slug: 'la-boucle-affective',  title: 'La boucle affective',   video: '/videos/projects/la-boucle-affective.mp4'  },
  { slug: 'labsence-insistante',  title: "L'absence insistante",  video: '/videos/projects/labsence-insistante.mp4'  },
]

export default function ProjectsPage() {
  const carouselRef = useRef(null)

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return

    let targetX  = 0
    let currentX = 0
    let rafId    = null
    let snapTimer = null

    const cardWidth = () => el.clientWidth * 0.85 + GAP

    const clamp = (v) => Math.max(0, Math.min(v, el.scrollWidth - el.clientWidth))

    const snapNearest = () => {
      const w = cardWidth()
      targetX = Math.round(targetX / w) * w
    }

    const onWheel = (e) => {
      e.preventDefault()
      targetX = clamp(targetX + e.deltaY * 1.2)

      // Snap vers la carte la plus proche après 180 ms d'inactivité
      clearTimeout(snapTimer)
      snapTimer = setTimeout(snapNearest, 180)
    }

    const tick = () => {
      const diff = targetX - currentX
      // Lerp : facteur 0.09 → décélération douce (~0.6 s)
      currentX += diff * 0.09
      if (Math.abs(diff) < 0.2) currentX = targetX
      el.scrollLeft = currentX
      rafId = requestAnimationFrame(tick)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    rafId = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(rafId)
      clearTimeout(snapTimer)
    }
  }, [])

  return (
    <main style={{ background: DARK, overflow: 'hidden', height: '100vh' }}>

      <div
        ref={carouselRef}
        className="carousel"
        style={{
          display: 'flex',
          height: '100vh',
          overflowX: 'auto',
          gap: `${GAP}px`,
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {PROJECTS.map((proj, i) => (
          <Link
            key={proj.slug}
            href={`/projects/${proj.slug}`}
            style={{
              flexShrink: 0,
              width: '85vw',
              height: '100vh',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Vidéo plein cadre */}
            <video
              src={proj.video}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />

            {/* Dégradé bas */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)',
              pointerEvents: 'none',
            }} />

            {/* Chapitre + titre */}
            <div style={{
              position: 'absolute',
              bottom: '60px', left: '48px', right: '48px',
              pointerEvents: 'none',
            }}>
              <h2 style={{
                fontFamily: "'PP Editorial New', 'Iowan Old Style', serif",
                fontWeight: 100,
                fontSize: '40px',
                lineHeight: 1.0,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: CREAM,
                transform: 'scaleY(4)',
                transformOrigin: 'bottom center',
                display: 'block',
              }}>
                {proj.title}
              </h2>
              <p style={{
                fontSize: '11px', letterSpacing: '0.18em', fontWeight: 300,
                color: CREAM, opacity: 0.45, marginTop: '3px',
              }}>
                chapitre.&nbsp;{i + 1}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </main>
  )
}
