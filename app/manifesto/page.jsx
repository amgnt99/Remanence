import Link from 'next/link'

const DARK  = '#0a0a0a'
const CREAM = '#f5f4f0'

export default function ManifestoPage() {
  return (
    <main style={{
      background: DARK,
      color: CREAM,
      fontFamily: "'Iowan Old Style', 'Iowan Old Style Roman', Georgia, serif",
      minHeight: '100vh',
      padding: '160px 0 140px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      {/* ── H1 hero — centré ────────────────────────────────────────────── */}
      <h1 style={{
        fontFamily: "'PP Editorial New', 'Iowan Old Style', serif",
        fontWeight: 100,
        fontSize: 'clamp(2.8rem, 5.5vw, 6rem)',
        lineHeight: 1.08,
        letterSpacing: '-0.02em',
        color: CREAM,
        width: '680px',
        maxWidth: '90vw',
        textAlign: 'center',
        marginBottom: '64px',
      }}>
        L'amour est-il une expérience vécue ou une expérience apprise&nbsp;?
      </h1>

      {/* ── Premier pavé — aligné à gauche ──────────────────────────────── */}
      <p style={{
        fontSize: '16px',
        lineHeight: 1.75,
        fontWeight: 300,
        color: CREAM,
        opacity: 0.78,
        width: '680px',
        maxWidth: '90vw',
        textAlign: 'left',
        marginBottom: '120px',
      }}>
        Nous avons tendance à croire que l'amour naît naturellement d'une rencontre. Pourtant, avant même de vivre cette expérience, nous avons déjà appris à la reconnaître. Depuis l'enfance, les films, les photographies, les romans, les publicités ou encore les réseaux sociaux construisent un imaginaire amoureux qui influence notre manière de désirer, d'attendre et d'interpréter nos émotions. Ces images ne racontent pas seulement l'amour : elles participent à façonner notre perception de ce qu'il est censé être. Elles deviennent des références invisibles qui orientent nos attentes et influencent notre manière d'entrer en relation avec l'autre.
      </p>

      {/* ── H2 — centré ─────────────────────────────────────────────────── */}
      <h2 style={{
        fontFamily: "'PP Editorial New', 'Iowan Old Style', serif",
        fontWeight: 100,
        fontSize: '34px',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
        color: CREAM,
        width: '680px',
        maxWidth: '90vw',
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        Comment rendre visible une influence qui agit de manière invisible&nbsp;?
      </h2>

      {/* ── Second pavé — aligné à gauche ───────────────────────────────── */}
      <p style={{
        fontSize: '16px',
        lineHeight: 1.75,
        fontWeight: 300,
        color: CREAM,
        opacity: 0.78,
        width: '680px',
        maxWidth: '90vw',
        textAlign: 'left',
      }}>
        REMANENCE est une installation immersive en réalité virtuelle née de cette réflexion. Issu du mémoire <em>Aimer sous images</em>, le projet transforme une recherche théorique en expérience sensible. À travers six espaces, le visiteur traverse les mécanismes psychologiques de l'attachement grâce à la lumière, au son et à l'espace. L'installation ne cherche pas à raconter une histoire d'amour, mais à faire ressentir les états perceptifs qui la construisent. En plongeant le visiteur au cœur de ces sensations, REMANENCE l'invite à interroger une dernière fois cette question : ce qu'il ressent provient-il de son expérience, ou des images qui lui ont appris à aimer&nbsp;?
      </p>

    </main>
  )
}
