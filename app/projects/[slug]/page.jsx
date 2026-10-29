'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'

/* ─────────────────────────────────────────────────────────────────────────
   Données projets
   ───────────────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    slug:  'labsence-disponible',
    title: "L'absence disponible",
    video: '/videos/projects/labsence-disponible.mp4',
    tagline: "Le désir commence parfois avant la rencontre.",
    description1: "L'attachement ne naît pas au moment où deux personnes se rencontrent. Il prend souvent forme plus tôt, dans un état de disponibilité intérieure où quelque chose attend déjà sans encore connaître son objet. Notre regard, notre mémoire et notre imagination préparent inconsciemment un espace où l'autre pourra apparaître. Cette attente ne correspond pas à un vide passif, mais à une ouverture, à une capacité d'être affecté.",
    description2: "Cette première installation donne une forme sensible à cet instant suspendu. L'espace est presque immobile, les sons sont rares et la lumière semble hésiter entre apparition et disparition. Rien n'est encore défini, mais tout semble prêt à accueillir une présence. Le visiteur traverse un état de calme où le manque n'est pas vécu comme une absence douloureuse, mais comme la condition même de la rencontre.",
    keywords: "Disponibilité psychique · Désir · Attente · Projection",
  },
  {
    slug:  'lattention-captive',
    title: "L'attention captive",
    video: '/videos/projects/lattention-captive.mp4',
    tagline: "Pourquoi une image devient-elle impossible à oublier ?",
    description1: "Chaque jour, notre cerveau sélectionne une infime partie des informations qu'il perçoit. Pourtant, certaines images échappent à cet oubli naturel. Elles reviennent, retiennent notre regard et finissent par occuper une place disproportionnée dans notre perception. Ce phénomène, appelé attention sélective, constitue souvent la première étape de l'attachement.",
    description2: "Cette installation traduit ce basculement progressif. Au fil de l'expérience, l'espace semble se resserrer autour d'un seul point, comme si le regard ne pouvait plus s'en détourner. Les lumières, les sons et les mouvements convergent lentement vers une présence qui devient progressivement centrale. Ce qui n'était qu'un détail devient une évidence. Le visiteur fait l'expérience d'une perception qui se réorganise peu à peu autour d'une seule image.",
    keywords: "Attention sélective · Saillance perceptive · Focalisation",
  },
  {
    slug:  'lautre-sous-la-peau',
    title: "L'autre sous la peau",
    video: '/videos/projects/lautre-sous-la-peau.mp4',
    tagline: "La proximité transforme notre manière d'habiter le monde.",
    description1: "Lorsque le lien se construit, l'autre cesse progressivement d'être une présence extérieure. Sa manière d'être, ses gestes, sa voix ou son souvenir s'intègrent à notre quotidien jusqu'à modifier notre propre perception. Sans nous en rendre compte, nous incorporons une partie de sa présence dans notre manière de penser, de ressentir et d'exister.",
    description2: "Cette installation explore cette porosité entre deux individus. Les matières semblent fusionner, les sons se répondent et les limites deviennent moins nettes. L'expérience ne cherche pas à représenter une personne, mais la manière dont une relation transforme silencieusement notre identité. À cet instant du parcours, le visiteur ne se contente plus d'observer l'autre : il commence à le porter en lui.",
    keywords: "Attachement · Incorporation · Identification · Proximité",
  },
  {
    slug:  'la-distance-dissoute',
    title: 'La distance dissoute',
    video: '/videos/projects/la-distance-dissoute.mp4',
    tagline: "Lorsque les frontières deviennent perméables.",
    description1: "L'intensité du lien amoureux modifie profondément notre rapport au monde. Les repères habituels s'effacent, le temps semble ralentir ou s'accélérer, et la distinction entre soi et l'autre devient momentanément moins évidente. Les émotions circulent librement et la perception s'étend au-delà des limites du corps.",
    description2: "Cette salle traduit cette expérience de fusion. Les particules, la lumière et le son créent un espace où les contours disparaissent progressivement. Rien n'est figé : tout se diffuse, se mélange et se transforme. Le visiteur est invité à traverser un état où la proximité semble suspendre la séparation, sans jamais l'effacer totalement.",
    keywords: "Fusion · Interdépendance · Dissolution des frontières · Perception",
  },
  {
    slug:  'la-boucle-affective',
    title: 'La boucle affective',
    video: '/videos/projects/la-boucle-affective.mp4',
    tagline: "Pourquoi certaines relations semblent-elles toujours revenir ?",
    description1: "Nos expériences affectives sont traversées par des schémas inconscients qui influencent notre manière d'aimer, de choisir et de revivre certaines situations. La psychologie les désigne comme des scripts relationnels : des modèles construits au fil de notre histoire qui orientent nos comportements sans que nous en ayons toujours conscience.",
    description2: "Cette installation traduit cette répétition par une accumulation progressive de sons, de lumières et de mouvements. Les éléments se superposent, reviennent et se transforment sans jamais trouver de véritable résolution. L'expérience devient plus dense, plus rapide et plus envahissante, jusqu'à produire une sensation de saturation. Le visiteur traverse une boucle où chaque retour semble promettre une sortie qui n'arrive jamais.",
    keywords: "Scripts relationnels · Répétition · Rumination · Saturation",
  },
  {
    slug:  'labsence-insistante',
    title: "L'absence insistante",
    video: '/videos/projects/labsence-insistante.mp4',
    tagline: "Ce qui disparaît continue parfois d'exister.",
    description1: "La fin d'une relation ne marque pas toujours la disparition de sa présence psychique. Les souvenirs, les sensations et certaines images persistent bien après l'absence de l'autre. Ils continuent d'influencer notre manière de percevoir le présent, parfois de façon imperceptible.",
    description2: "Cette dernière installation explore la notion de rémanence : la persistance d'une trace après la disparition de sa source. L'espace est plus silencieux, plus dépouillé, mais il reste habité par ce qui a précédé. Les sons s'éloignent, les lumières s'atténuent, pourtant quelque chose demeure. Le parcours se termine, mais l'expérience ne s'interrompt pas réellement. Comme les relations qui nous traversent, certaines images continuent d'exister longtemps après avoir disparu de notre regard.",
    keywords: "Rémanence · Mémoire affective · Persistance · Trace psychique",
  },
]

/* ─────────────────────────────────────────────────────────────────────────
   Styles réutilisables
   ───────────────────────────────────────────────────────────────────────── */
const DARK  = '#0a0a0a'
const CREAM = '#f5f4f0'
const PX    = '120px'

export default function ProjectPage({ params }) {
  const index = PROJECTS.findIndex(p => p.slug === params.slug)
  if (index === -1) notFound()

  const project = PROJECTS[index]
  const next    = PROJECTS[(index + 1) % PROJECTS.length]
  const chapter = index + 1

  const router       = useRouter()
  const heroRef      = useRef(null)
  const nextRef      = useRef(null)
  const navigated    = useRef(false)
  const [overlay, setOverlay] = useState(0)   // 0→1
  const [vidProg, setVidProg] = useState(0)   // 0→1, pilote largeur + remontée
  const [pageOpacity, setPageOpacity] = useState(0) // fade-in à chaque navigation

  // Précharge la page suivante dès le montage
  useEffect(() => {
    router.prefetch(`/projects/${next.slug}`)
  }, [next.slug])

  // Reset + fade-in à chaque changement de projet
  useEffect(() => {
    navigated.current = false
    setVidProg(0)
    setPageOpacity(0)
    window.scrollTo(0, 0)
    const t = requestAnimationFrame(() => setPageOpacity(1))
    return () => cancelAnimationFrame(t)
  }, [params.slug])

  useEffect(() => {
    const onScroll = () => {
      // Hero overlay
      const el = heroRef.current
      if (el) {
        const top   = el.getBoundingClientRect().top
        const range = el.offsetHeight - window.innerHeight
        setOverlay(Math.max(0, Math.min(1, -top / range)))
      }
      // Next project video expansion → auto-navigation à 100%
      const nextEl = nextRef.current
      if (nextEl) {
        const rect = nextEl.getBoundingClientRect()
        const prog  = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight * 0.8)))
        setVidProg(prog)
        if (prog >= 0.99 && !navigated.current) {
          navigated.current = true
          router.push(`/projects/${next.slug}`)
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [next.slug])

  return (
    <main style={{ background: DARK, color: CREAM, fontFamily: 'inherit', opacity: pageOpacity, transition: 'opacity 0.5s ease' }}>

      {/* ──────────────────────────────────────────────────────────────────
          HERO STICKY — 180vh : 100vh image + 80vh de course scroll
          ────────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ position: 'relative', height: '180vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* Vidéo plein écran */}
          <video
            src={project.video}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Dégradé bas pour lisibilité du titre */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,0.90) 0%, rgba(10,10,10,0.20) 35%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          {/* Dégradé haut — sécurise la lecture de la nav */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.45) 0%, transparent 18%)',
            pointerEvents: 'none',
          }} />

          {/* Titre centré · chapitre en dessous */}
          <div style={{
            position: 'absolute', bottom: '80px', left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            pointerEvents: 'none',
          }}>
            <h1 style={{
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
              textAlign: 'center',
              marginBottom: '-10px',
            }}>
              {project.title}
            </h1>
            <p style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              fontWeight: 300,
              color: CREAM,
              opacity: 0.45,
            }}>
              chapitre.&nbsp;{chapter}
            </p>
          </div>

          {/* Bloc noir qui monte — hauteur proportionnelle au contenu */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            background: DARK,
            transform: `translateY(${(1 - overlay) * 100}%)`,
            willChange: 'transform',
          }}>

            {/* Contenu principal — 100px haut, 250px côtés */}
            <div style={{ padding: '100px 250px 0' }}>

              {/* Accroche — PP Editorial New ultralight */}
              <p style={{
                fontFamily: "'PP Editorial New', 'Iowan Old Style', serif",
                fontWeight: 100,
                fontSize: 'clamp(1.8rem, 3vw, 3.2rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: CREAM,
                marginBottom: '40px',
              }}>
                {project.tagline}
              </p>

              {/* 2 colonnes — Iowan Old Style roman 14px */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '48px',
                alignItems: 'start',
              }}>
                <p style={{ fontSize: '14px', lineHeight: '16px', fontWeight: 300, opacity: 0.68 }}>
                  {project.description1}
                </p>
                <p style={{ fontSize: '14px', lineHeight: '16px', fontWeight: 300, opacity: 0.68 }}>
                  {project.description2}
                </p>
              </div>

            </div>

            {/* Mots-clés — 40px sous le texte, pleine largeur, 100px en bas */}
            <div style={{
              marginTop: '60px',
              borderTop: '1px solid rgba(245,244,240,0.10)',
              padding: '20px 40px 100px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}>
              {project.keywords.split(' · ').map((kw, i) => (
                <span key={i} style={{
                  fontFamily: "'Iowan Old Style', 'Iowan Old Style Roman', Georgia, serif",
                  fontWeight: 900,
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: CREAM,
                  opacity: 0.55,
                }}>
                  {kw}
                </span>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          PROJET SUIVANT — fond crème
          ────────────────────────────────────────────────────────────────── */}
      <section style={{ background: CREAM, color: DARK }}>

        {/* Label "projet suivant" — se comprime et disparaît au scroll */}
        <div style={{
          textAlign: 'center',
          paddingTop: `${Math.round(120 * (1 - vidProg))}px`,
          maxHeight: `${Math.round(160 * (1 - vidProg))}px`,
          overflow: 'hidden',
          opacity: Math.max(0, 1 - vidProg * 3),
        }}>
          <p style={{ fontSize: '14px', fontWeight: 300, letterSpacing: '0.06em', opacity: 0.45 }}>
            projet suivant
          </p>
        </div>

        {/* Conteneur vidéo + titre superposé */}
        <div
          ref={nextRef}
          style={{
            position: 'relative',
            width: `${65 + vidProg * 35}%`,
            margin: `${Math.round(80 * (1 - vidProg))}px auto 0`,
            paddingBottom: '120px',
          }}
        >
          {/* Vidéo */}
          <div style={{ overflow: 'hidden' }}>
            <Link href={`/projects/${next.slug}`} style={{ display: 'block' }}>
              <video
                src={next.video}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%', aspectRatio: '16/10',
                  objectFit: 'cover', display: 'block',
                  transition: 'transform 0.9s cubic-bezier(0.25,0,0,1)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </Link>
          </div>
        </div>

      </section>


    </main>
  )
}
