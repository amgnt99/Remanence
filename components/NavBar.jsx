'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function NavBar() {
  const pathname   = usePathname()
  const isHomePage = pathname === '/'

  // Sur les pages projet le fond est toujours noir — logo et bouton en clair dès le départ
  const [onDark, setOnDark]       = useState(!isHomePage)
  const [hoverLogo, setHoverLogo] = useState(false)

  useEffect(() => {
    if (!isHomePage) {
      setOnDark(true)
      return
    }
    const onScroll = () => {
      setOnDark(window.scrollY / (4 * window.innerHeight) > 0.65)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHomePage])

  const fg = onDark ? '#f5f4f0' : '#0a0a0a'

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 200,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 32px',
      pointerEvents: 'none',
    }}>

      {/* Logo — haut gauche */}
      <Link
        href="/"
        style={{ pointerEvents: 'all', display: 'block' }}
        onMouseEnter={() => setHoverLogo(true)}
        onMouseLeave={() => setHoverLogo(false)}
      >
        {/* img natif — le SVG reste vectoriel à toute résolution, pas de rasterisation */}
        <img
          src={
            onDark
              ? (hoverLogo ? '/logowhiteoutline.svg' : '/logowhite.svg')
              : (hoverLogo ? '/logonoiroutline.svg' : '/logonoir.svg')
          }
          alt="rémanence"
          width={130}
          height={52}
          style={{ display: 'block' }}
        />
      </Link>

      {/* Liens droite */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center', pointerEvents: 'all' }}>
        <Link
          href="/manifesto"
          style={{
            color: fg,
            fontFamily: 'inherit',
            fontWeight: 300,
            fontSize: '11px',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            paddingBottom: '3px',
            borderBottom: '1px solid transparent',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderBottomColor = fg}
          onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
        >
          manifesto
        </Link>
        <Link
          href="/projects"
          style={{
            color: fg,
            fontFamily: 'inherit',
            fontWeight: 900,
            fontSize: '11px',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            paddingBottom: '3px',
            borderBottom: '1px solid transparent',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderBottomColor = fg}
          onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
        >
          salles
        </Link>
      </div>
    </nav>
  )
}
